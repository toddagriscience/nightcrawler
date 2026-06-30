// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarSearchButton from './sidebar-search-button';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

vi.mock('@/app/(authenticated)/actions/search-modal', () => ({
  getSearchModalData: vi.fn(async () => ({ imps: [], seeds: [] })),
}));

describe('SidebarSearchButton', () => {
  it('renders a Search button and no modal initially', () => {
    render(<SidebarSearchButton />);
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the search modal when the Search button is clicked', () => {
    render(<SidebarSearchButton />);
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
