// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LogoutLink from './logout-link';

const { mockLogout } = vi.hoisted(() => ({
  mockLogout: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
  logout: mockLogout,
}));

describe('LogoutLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogout.mockResolvedValue({ error: null });
  });

  it('triggers logout when clicked and leaves navigation to logout', async () => {
    const user = userEvent.setup();
    render(<LogoutLink label="Log out" />);

    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
