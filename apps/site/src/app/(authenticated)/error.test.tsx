// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthErrorPage from './error';

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

describe('AuthErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogout.mockResolvedValue({ error: null });
  });

  it('logs out without routing itself when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthErrorPage />);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
    // `logout()` hard-navigates; a push here would race it.
    expect(mockPush).not.toHaveBeenCalled();
  });
});
