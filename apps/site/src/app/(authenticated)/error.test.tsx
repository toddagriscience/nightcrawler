// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AuthErrorPage from './error';

const mockLogout = vi.fn(() => Promise.resolve());
const mockRedirect = vi.fn();

vi.mock('@/lib/auth-client', () => ({
  logout: () => mockLogout(),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path),
}));

describe('AuthErrorPage', () => {
  it('logs out when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthErrorPage />);

    await user.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
