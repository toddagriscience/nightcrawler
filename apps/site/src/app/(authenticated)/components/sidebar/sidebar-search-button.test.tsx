// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarSearchButton from './sidebar-search-button';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('SidebarSearchButton', () => {
  it('renders a Search link pointing at /search', () => {
    render(<SidebarSearchButton />);
    const link = screen.getByRole('link', { name: /Search/i });
    expect(link).toHaveAttribute('href', '/search');
  });

  it('renders an icon (react-icons svg, no on-disk image)', () => {
    const { container } = render(<SidebarSearchButton />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // The legacy <Icon> wrapper rendered an <img>; ensure it is gone.
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
