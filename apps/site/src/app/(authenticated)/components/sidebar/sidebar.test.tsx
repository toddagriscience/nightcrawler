// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchPanelProvider } from '../search-panel/search-panel-context';
import Sidebar from './sidebar';
import { SidebarCollapseProvider } from './sidebar-collapse-context';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

const getSidebarManagementZones = vi.fn(async () => [
  {
    id: 1,
    name: 'North Field',
    isPending: false,
    createdAt: new Date('2026-10-02T00:00:00Z'),
  },
  {
    id: 2,
    name: 'South Field',
    isPending: true,
    createdAt: new Date('2026-10-01T00:00:00Z'),
  },
]);

vi.mock('@/app/(authenticated)/(no-sidebar)/account/db', () => ({
  getSidebarManagementZones: () => getSidebarManagementZones(),
  getAccountShellData: async () => ({ farmName: 'Green Acres' }),
}));

// Sidebar is an async server component, so resolve it before handing the
// element tree to render().
async function renderSidebar() {
  return render(
    <SidebarCollapseProvider>
      <SearchPanelProvider>{await Sidebar()}</SearchPanelProvider>
    </SidebarCollapseProvider>
  );
}

afterEach(() => {
  localStorage.clear();
  getSidebarManagementZones.mockClear();
});

describe('Sidebar', () => {
  it('shows the farm name at the top', async () => {
    await renderSidebar();
    expect(screen.getByText('Green Acres')).toBeInTheDocument();
  });

  it('renders the primary nav links', async () => {
    await renderSidebar();
    // Search is a modal trigger (button), not a route link.
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reminders/i })).toHaveAttribute(
      'href',
      '/reminders'
    );
    expect(screen.getByRole('link', { name: /Account/i })).toHaveAttribute(
      'href',
      '/account'
    );
    expect(
      screen.queryByRole('link', { name: /Orders/i })
    ).not.toBeInTheDocument();
  });

  it('lists the management zones (read-only)', async () => {
    await renderSidebar();
    expect(screen.getByText(/Management Zones/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /North Field/i })).toHaveAttribute(
      'href',
      '/?zone=1'
    );
    expect(screen.getByRole('link', { name: /South Field/i })).toHaveAttribute(
      'href',
      '/?zone=2'
    );
    expect(screen.getByText('Alt 1')).toBeInTheDocument();
    expect(screen.getByText('Alt 2')).toBeInTheDocument();
  });

  it('marks pending zones with a status dot', async () => {
    await renderSidebar();
    const dots = screen.getAllByRole('img', { name: /pending review/i });
    // Only the pending zone (South Field) shows the dot.
    expect(dots).toHaveLength(1);
  });

  it('defaults to the oldest zone even when it is not first alphabetically or id 1', async () => {
    await renderSidebar();
    expect(screen.getByRole('link', { name: /South Field/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(
      screen.getByRole('link', { name: /North Field/i })
    ).not.toHaveAttribute('aria-current');
  });

  it('uses the dashboard id tie-breaker for zones created at the same time', async () => {
    const createdAt = new Date('2026-10-01T00:00:00Z');
    getSidebarManagementZones.mockResolvedValueOnce([
      { id: 90, name: 'North Field', isPending: false, createdAt },
      { id: 27, name: 'South Field', isPending: false, createdAt },
    ]);

    await renderSidebar();

    expect(screen.getByRole('link', { name: /South Field/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(
      screen.getByRole('link', { name: /North Field/i })
    ).not.toHaveAttribute('aria-current');
  });

  it('does not render add or delete zone controls', async () => {
    await renderSidebar();
    expect(
      screen.queryByRole('button', { name: /New Zone/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /delete/i })
    ).not.toBeInTheDocument();
  });
});
