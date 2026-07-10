// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountSideMenu from './account-side-menu';

const { mockUsePathname, mockPush, mockLogout } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
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
    usePathname: mockUsePathname,
    useRouter: () => ({ push: mockPush }),
  };
});

const accountSideMenuProps = {
  farmName: 'Blue River Farm',
  contactName: 'Jane Farmer',
  contactEmail: 'jane@example.com',
  contactPhone: '555-123-4567',
};

describe('AccountSideMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/account/privacy');
    mockLogout.mockResolvedValue({ error: null });
  });

  it('displays the farm and contact information', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    expect(screen.getByText('Blue River Farm')).toBeInTheDocument();
    expect(screen.getByText('Jane Farmer')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-123-4567')).toBeInTheDocument();
  });

  it('marks the active account section', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('calls logout flow when clicking log out', async () => {
    const user = userEvent.setup();
    render(<AccountSideMenu {...accountSideMenuProps} />);

    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
