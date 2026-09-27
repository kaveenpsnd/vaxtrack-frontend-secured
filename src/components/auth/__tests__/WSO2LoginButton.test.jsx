import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WSO2LoginButton from '../WSO2LoginButton';

describe('WSO2LoginButton', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('renders with default label', () => {
    render(<WSO2LoginButton />);
    expect(screen.getByRole('button', { name: /sign in with wso2/i })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<WSO2LoginButton label="Sign up with WSO2 Identity Server" />);
    expect(screen.getByRole('button', { name: /sign up with wso2 identity server/i })).toBeInTheDocument();
  });

  it('redirects to backend SSO endpoint when clicked', () => {
    render(<WSO2LoginButton />);
    const button = screen.getByRole('button', { name: /sign in with wso2/i });
    fireEvent.click(button);
    expect(window.location.href).toContain('/auth/wso2/login');
  });
});
