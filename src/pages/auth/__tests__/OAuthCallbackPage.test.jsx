import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import OAuthCallbackPage from '../OAuthCallbackPage';
import useAuthStore from '../../../store/useAuthStore';
import toast from 'react-hot-toast';

const mockNavigate = vi.fn();
let mockState = { isLoading: true, isAuthenticated: false };
let mockGetBasicUserInfo = vi.fn();
let mockError = null;

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@asgardeo/auth-react', () => ({
  useAuthContext: () => ({
    state: mockState,
    getBasicUserInfo: mockGetBasicUserInfo,
    error: mockError,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = { isLoading: true, isAuthenticated: false };
    mockError = null;
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('renders loading state initially while verifying', () => {
    render(<OAuthCallbackPage />);
    expect(screen.getByText(/verifying with wso2 identity server/i)).toBeInTheDocument();
    expect(screen.getByText(/completing openid connect verification/i)).toBeInTheDocument();
  });

  it('navigates to /dashboard and sets user with Public role when authenticated', async () => {
    mockState = { isLoading: false, isAuthenticated: true };
    mockGetBasicUserInfo.mockResolvedValueOnce({
      sub: 'wso2-user-123',
      displayName: 'Alice Perera',
      email: 'alice@example.com',
      username: 'alice',
    });

    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(mockGetBasicUserInfo).toHaveBeenCalled();
    });

    const currentUser = useAuthStore.getState().user;
    expect(currentUser).not.toBeNull();
    expect(currentUser.name).toBe('Alice Perera');
    expect(currentUser.email).toBe('alice@example.com');
    // Mandatory security assertion: role must always be forced to 'Public'
    expect(currentUser.role).toBe('Public');
    expect(currentUser.authProvider).toBe('wso2');

    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Alice'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('handles error and redirects to /login', async () => {
    mockError = new Error('Access denied by Identity Server');
    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Access denied by Identity Server');
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });
});
