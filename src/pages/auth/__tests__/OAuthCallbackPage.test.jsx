import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import OAuthCallbackPage from '../OAuthCallbackPage';
import useAuthStore from '../../../store/useAuthStore';
import toast from 'react-hot-toast';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('renders loading indicator while completing verification', () => {
    render(<OAuthCallbackPage />);
    expect(screen.getByText(/completing wso2 authentication/i)).toBeInTheDocument();
  });

  it('calls checkAuth, sets session, and navigates to /dashboard when valid', async () => {
    const mockCheckAuth = vi.fn().mockResolvedValueOnce({
      _id: 'user-123',
      name: 'Kumara Silva',
      email: 'kumara@example.com',
      role: 'Public',
    });
    useAuthStore.setState({ checkAuth: mockCheckAuth });

    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(mockCheckAuth).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Kumara'));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('navigates to /login with sso_error=session if checkAuth returns null', async () => {
    const mockCheckAuth = vi.fn().mockResolvedValueOnce(null);
    useAuthStore.setState({ checkAuth: mockCheckAuth });

    render(<OAuthCallbackPage />);

    await waitFor(() => {
      expect(mockCheckAuth).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Failed to establish session from WSO2 login.');
      expect(mockNavigate).toHaveBeenCalledWith('/login?sso_error=session', { replace: true });
    });
  });
});
