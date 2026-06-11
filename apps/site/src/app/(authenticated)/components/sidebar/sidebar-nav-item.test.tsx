// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarNavItem from './sidebar-nav-item';

describe('SidebarNavItem', () => {
  const mockIcon = <svg data-testid="icon" />;

  it('renders link when href is provided', () => {
    render(
      <SidebarNavItem href="/account" icon={mockIcon}>
        Account
      </SidebarNavItem>
    );
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
      'href',
      '/account'
    );
  });

  it('renders button when onClick is provided', () => {
    const handleClick = vi.fn();
    render(
      <SidebarNavItem href={undefined} icon={mockIcon} onClick={handleClick}>
        Action
      </SidebarNavItem>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders children text', () => {
    render(
      <SidebarNavItem href="/account" icon={mockIcon}>
        My Account Link
      </SidebarNavItem>
    );
    expect(screen.getByText('My Account Link')).toBeInTheDocument();
  });
});
