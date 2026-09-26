import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import LoginPage from '../LoginPage';

const mockSignIn = vi.fn();

vi.mock('@asgardeo/auth-react', () => ({
  useAuthContext: () => ({
    signIn: mockSignIn,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('automatically triggers WSO2 signIn on mount', async () => {
    mockSignIn.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/sign in with wso2 identity server/i)).toBeInTheDocument();
    expect(screen.getByText(/redirecting to wso2 identity server/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error and retry button if redirect fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Connection to Identity Server refused'));
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/connection to identity server refused/i)).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /retry wso2 sign in/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(mockSignIn).toHaveBeenCalledTimes(2);
  });
});
