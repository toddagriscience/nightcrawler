// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountSideMenu from './account-side-menu';

const { mockUsePathname, mockLogout } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
  mockLogout: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
  logout: mockLogout,
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    usePathname: mockUsePathname,
  };
});

describe('AccountSideMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/account/privacy');
    mockLogout.mockResolvedValue({ error: null });
  });

  it('marks the active account section', () => {
    render(<AccountSideMenu />);

    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('renders a help link pointing to the support page', () => {
    render(<AccountSideMenu />);

    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('calls logout when clicking log out and leaves navigation to logout', async () => {
    const user = userEvent.setup();
    render(<AccountSideMenu />);

    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
