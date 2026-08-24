// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AuthErrorFallback from './auth-error-fallback';

const mockLogout = vi.fn(() => Promise.resolve());

vi.mock('@/lib/auth-client', () => ({
  logout: () => mockLogout(),
}));

describe('AuthErrorFallback', () => {
  it('logs out when the log out button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthErrorFallback />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('offers the terms, privacy and system status links', () => {
    render(<AuthErrorFallback />);

    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute(
      'href',
      '/terms'
    );
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'System Status' })).toHaveAttribute(
      'href',
      'https://status.toddagriscience.com'
    );
  });
  it('states the error on a single line', () => {
    render(<AuthErrorFallback />);

    expect(
      screen.getByRole('heading', {
        name: 'Something went wrong. Please logout and try again.',
      })
    ).toBeInTheDocument();
  });
});
