// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SidebarCollapseToggle from './sidebar-collapse-toggle';
import {
  SidebarCollapseProvider,
  useSidebarCollapse,
} from './sidebar-collapse-context';

function renderToggle() {
  return render(
    <SidebarCollapseProvider>
      <SidebarCollapseToggle />
    </SidebarCollapseProvider>
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('SidebarCollapseToggle', () => {
  it('starts expanded and offers to collapse', () => {
    renderToggle();
    expect(
      screen.getByRole('button', { name: /Collapse sidebar/i })
    ).toBeInTheDocument();
  });

  it('toggles collapse state on click and persists to localStorage', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: /Collapse sidebar/i }));
    expect(
      screen.getByRole('button', { name: /Expand sidebar/i })
    ).toBeInTheDocument();
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /Expand sidebar/i }));
    expect(
      screen.getByRole('button', { name: /Collapse sidebar/i })
    ).toBeInTheDocument();
    expect(localStorage.getItem('sidebar-collapsed')).toBe('false');
  });
});

describe('useSidebarCollapse', () => {
  it('throws when used outside the provider', () => {
    function Orphan() {
      useSidebarCollapse();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/SidebarCollapseProvider/);
  });
});
