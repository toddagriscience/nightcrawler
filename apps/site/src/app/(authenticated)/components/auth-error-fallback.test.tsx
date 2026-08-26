// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthErrorFallback from './auth-error-fallback';

const { mockPush, mockLogout } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockLogout: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
  logout: mockLogout,
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
  };
});

describe('AuthErrorFallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogout.mockResolvedValue({ error: null });
  });

  it('logs out when the log out button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthErrorFallback />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('leaves navigation to logout instead of routing itself', async () => {
    // `logout()` hard-navigates the document with `window.location.replace`.
    // A client-side push here would race that navigation, so this page must
    // not route at all — see the contract on `logout()`.
    const user = userEvent.setup();
    render(<AuthErrorFallback />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not route when logout reports a failure either', async () => {
    mockLogout.mockResolvedValue({ error: new Error('nope') });
    const user = userEvent.setup();
    render(<AuthErrorFallback />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
    expect(mockPush).not.toHaveBeenCalled();
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

  it('reads as one sentence pair while rendering each sentence on its own line', () => {
    render(<AuthErrorFallback />);

    const heading = screen.getByRole('heading', {
      name: 'Something went wrong. Please logout and try again.',
    });

    // Two block spans rather than one wrapping string, so the copy never
    // breaks mid-clause ("...and try / again.") on a narrow viewport.
    const lines = Array.from(heading.querySelectorAll('span.block')).map(
      (span) => span.textContent
    );
    expect(lines).toEqual([
      'Something went wrong.',
      'Please logout and try again.',
    ]);
  });
});
