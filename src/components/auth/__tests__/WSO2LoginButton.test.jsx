import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WSO2LoginButton from '../WSO2LoginButton';

// Mock @asgardeo/auth-react
const mockSignIn = vi.fn();
let mockState = { isLoading: false, isAuthenticated: false };

vi.mock('@asgardeo/auth-react', () => ({
  useAuthContext: () => ({
    signIn: mockSignIn,
    state: mockState,
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('WSO2LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = { isLoading: false, isAuthenticated: false };
  });

  it('renders with default label', () => {
    render(<WSO2LoginButton />);
    expect(screen.getByRole('button', { name: /sign in with wso2/i })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<WSO2LoginButton label="Sign up with WSO2 Identity Server" />);
    expect(screen.getByRole('button', { name: /sign up with wso2 identity server/i })).toBeInTheDocument();
  });

  it('calls signIn when clicked', async () => {
    mockSignIn.mockResolvedValueOnce({});
    render(<WSO2LoginButton />);
    const button = screen.getByRole('button', { name: /sign in with wso2/i });
    fireEvent.click(button);
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner and disables button when loading', () => {
    mockState = { isLoading: true, isAuthenticated: false };
    render(<WSO2LoginButton />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/connecting to wso2/i)).toBeInTheDocument();
  });
});
