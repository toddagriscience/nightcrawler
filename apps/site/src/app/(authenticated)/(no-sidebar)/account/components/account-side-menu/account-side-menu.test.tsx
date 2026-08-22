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
  contactPhone: '+15551234567',
};

describe('AccountSideMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/account/privacy');
    mockLogout.mockResolvedValue({ error: null });
  });

  it('names the complementary region with the farm name as an h2', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Blue River Farm',
    });

    expect(heading).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: 'Blue River Farm' })
    ).toContainElement(heading);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('offers the route out of the account tree in its own site nav', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    const siteNav = screen.getByRole('navigation', { name: 'Site' });
    const homeLink = screen.getByRole('link', { name: 'Home' });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(siteNav).toContainElement(homeLink);
    expect(
      screen.getByRole('navigation', { name: 'Account sections' })
    ).not.toContainElement(homeLink);
  });

  it('links the primary contact email and phone', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    expect(screen.getByText('Jane Farmer')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'jane@example.com' })
    ).toHaveAttribute('href', 'mailto:jane@example.com');
    expect(screen.getByRole('link', { name: '+15551234567' })).toHaveAttribute(
      'href',
      'tel:+15551234567'
    );
  });

  it('strips presentation characters out of the tel: target', () => {
    render(
      <AccountSideMenu
        {...accountSideMenuProps}
        contactPhone="(555) 123-4567"
      />
    );

    expect(
      screen.getByRole('link', { name: '(555) 123-4567' })
    ).toHaveAttribute('href', 'tel:5551234567');
  });

  it('renders unset contact details as plain text instead of links', () => {
    render(
      <AccountSideMenu
        {...accountSideMenuProps}
        contactEmail="Not set"
        contactPhone="Not set"
      />
    );

    expect(screen.getAllByText('Not set')).toHaveLength(2);
    expect(
      screen.queryByRole('link', { name: 'Not set' })
    ).not.toBeInTheDocument();
  });

  it.each([
    ['empty', '', ''],
    ['whitespace', '   ', '   '],
    ['placeholder', 'N/A', 'N/A'],
    ['partial', 'jane@', '555'],
  ])(
    'never emits an undialable or unmailable link for %s values',
    (_label, contactEmail, contactPhone) => {
      render(
        <AccountSideMenu
          {...accountSideMenuProps}
          contactEmail={contactEmail}
          contactPhone={contactPhone}
        />
      );

      for (const link of screen.getAllByRole('link')) {
        const href = link.getAttribute('href') ?? '';

        expect(href).not.toMatch(/^mailto:/);
        expect(href).not.toMatch(/^tel:/);
      }
    }
  );

  it('marks the active account section', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('renders a help link pointing to the support page', () => {
    render(<AccountSideMenu {...accountSideMenuProps} />);

    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute(
      'href',
      '/contact'
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
