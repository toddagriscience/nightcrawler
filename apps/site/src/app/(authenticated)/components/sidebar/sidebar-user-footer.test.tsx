// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarUserFooter from './sidebar-user-footer';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('SidebarUserFooter', () => {
  it('renders an Account link', () => {
    render(<SidebarUserFooter />);
    const link = screen.getByRole('link', { name: /Account/i });
    expect(link).toHaveAttribute('href', '/account');
  });

  it('does not render a log out control', () => {
    render(<SidebarUserFooter />);
    expect(
      screen.queryByRole('button', { name: /log out/i })
    ).not.toBeInTheDocument();
  });
});
