import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '', search: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('automatically redirects to WSO2 backend login URL when no error exists', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/sign in with wso2 identity server/i)).toBeInTheDocument();
    expect(screen.getByText(/redirecting to wso2 identity server/i)).toBeInTheDocument();
    expect(window.location.href).toContain('/auth/wso2/login');
  });

  it('displays user-friendly error message when sso_error is in search params', () => {
    render(
      <MemoryRouter initialEntries={['/login?sso_error=denied']}>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/authentication was cancelled or access was denied/i)).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /retry wso2 sign in/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(window.location.href).toContain('/auth/wso2/login');
  });

  it('goes to the landing page instead of signing in again right after logout', () => {
    sessionStorage.setItem('vaxtrack_logged_out', '1');

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<p>Landing</p>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Landing')).toBeInTheDocument();
    expect(window.location.href).toBe('');
    expect(sessionStorage.getItem('vaxtrack_logged_out')).toBeNull();
  });
});
