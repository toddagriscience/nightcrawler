// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SidebarClient, { isSidebarHiddenForPath } from './sidebar-client';
import { SidebarCollapseProvider } from './sidebar-collapse-context';

const usePathname = vi.fn(() => '/');

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}));

function renderClient() {
  return render(
    <SidebarCollapseProvider>
      <SidebarClient>
        <nav data-testid="sidebar-contents">Sidebar</nav>
      </SidebarClient>
    </SidebarCollapseProvider>
  );
}

afterEach(() => {
  localStorage.clear();
  usePathname.mockReset();
  usePathname.mockReturnValue('/');
});

describe('isSidebarHiddenForPath', () => {
  it.each([
    '/account/reset-password',
    '/apply',
    '/welcome',
    '/application-success',
  ])('returns true for excluded path %s', (path) => {
    expect(isSidebarHiddenForPath(path)).toBe(true);
  });

  it('returns true for a nested subpath of an excluded route', () => {
    expect(isSidebarHiddenForPath('/apply/step-2')).toBe(true);
    expect(isSidebarHiddenForPath('/account/reset-password/confirm')).toBe(
      true
    );
  });

  it('returns false for normal platform paths', () => {
    expect(isSidebarHiddenForPath('/order')).toBe(false);
    expect(isSidebarHiddenForPath('/reminders')).toBe(false);
  });

  it('returns false for the account root (sidebar should still show)', () => {
    expect(isSidebarHiddenForPath('/account')).toBe(false);
  });

  it('returns false for the viewer-agreement route (own layout, no sidebar)', () => {
    // /account/agreement is excluded via its route group, not this helper.
    expect(isSidebarHiddenForPath('/account/agreement')).toBe(false);
  });
});

describe('SidebarClient', () => {
  it('renders null on an excluded path', () => {
    usePathname.mockReturnValue('/apply');
    const { container } = renderClient();
    expect(screen.queryByTestId('sidebar-contents')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders children on a normal path', () => {
    usePathname.mockReturnValue('/order');
    renderClient();
    // children are rendered in both the desktop panel and the mobile sheet
    expect(screen.getAllByTestId('sidebar-contents').length).toBeGreaterThan(0);
  });
});
