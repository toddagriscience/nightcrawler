// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderHook, renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { useMenuItems } from './menu-items';
import MobileMenuItem from './mobile-menu-item';
import { fireEvent } from '@testing-library/react';

describe('useMenuItems - Research dropdown', () => {
  it('exposes the Research entry as a dropdown with two sub-items', () => {
    const { result } = renderHook(() => useMenuItems({}));

    const research = result.current.menuItems.find(
      (item) => item.title === 'Research'
    );

    expect(research).toBeDefined();
    expect(research?.url).toBe('/research');
    expect(research?.items).toEqual([
      { title: 'Research Overview', url: '/research' },
      { title: 'Articles', url: '/research/index' },
    ]);
  });

  it('respects caller-provided menu overrides', () => {
    const menu = [{ title: 'Custom', url: '/custom' }];
    const { result } = renderHook(() => useMenuItems({ menu }));

    expect(result.current.menuItems).toEqual(menu);
  });
});

describe('Research dropdown rendering', () => {
  const researchItem = {
    title: 'Research',
    url: '/research',
    items: [
      { title: 'Research Overview', url: '/research' },
      { title: 'Articles', url: '/research/index' },
    ],
  };

  it('renders a dropdown trigger and reveals both sub-links on expand', () => {
    renderWithNextIntl(
      <MobileMenuItem item={researchItem} onNavigate={() => {}} />
    );

    const trigger = screen.getByRole('button', { name: /Research/ });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const overview = screen.getByRole('link', { name: 'Research Overview' });
    expect(overview).toHaveAttribute('href', '/research');

    const articles = screen.getByRole('link', { name: 'Articles' });
    expect(articles).toHaveAttribute('href', '/research/index');
  });
});
