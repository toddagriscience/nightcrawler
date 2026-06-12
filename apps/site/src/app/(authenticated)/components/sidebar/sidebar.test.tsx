// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Sidebar from './sidebar';
import { SidebarCollapseProvider } from './sidebar-collapse-context';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

function renderSidebar() {
  return render(
    <SidebarCollapseProvider>
      <Sidebar />
    </SidebarCollapseProvider>
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('Sidebar', () => {
  it('renders the primary nav links', () => {
    renderSidebar();
    expect(screen.getByRole('link', { name: /Search/i })).toHaveAttribute(
      'href',
      '/search'
    );
    expect(screen.getByRole('link', { name: /Reminders/i })).toHaveAttribute(
      'href',
      '/reminders'
    );
    expect(screen.getByRole('link', { name: /Orders/i })).toHaveAttribute(
      'href',
      '/order'
    );
    expect(screen.getByRole('link', { name: /Account/i })).toHaveAttribute(
      'href',
      '/account'
    );
  });

  it('does not render the management zones section', () => {
    renderSidebar();
    expect(screen.queryByText(/Management Zones/i)).not.toBeInTheDocument();
  });

  it('does not render a New Zone button', () => {
    renderSidebar();
    expect(
      screen.queryByRole('button', { name: /New Zone/i })
    ).not.toBeInTheDocument();
  });

  it('uses react-icons svgs, not on-disk image icons', () => {
    const { container } = renderSidebar();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
