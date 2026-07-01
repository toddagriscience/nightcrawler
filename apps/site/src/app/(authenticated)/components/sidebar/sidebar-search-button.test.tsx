// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SidebarSearchButton from './sidebar-search-button';
import {
  SearchPanelProvider,
  useSearchPanel,
} from '../search-panel/search-panel-context';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

/** Renders the panel's open state so the toggle can be asserted. */
function OpenState() {
  const { open } = useSearchPanel();
  return <span data-testid="panel-open">{String(open)}</span>;
}

function renderButton() {
  return render(
    <SearchPanelProvider>
      <SidebarSearchButton />
      <OpenState />
    </SearchPanelProvider>
  );
}

describe('SidebarSearchButton', () => {
  it('renders a Search button (not a link)', () => {
    renderButton();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /Search/i })
    ).not.toBeInTheDocument();
  });

  it('toggles the search panel open state when clicked', () => {
    renderButton();
    expect(screen.getByTestId('panel-open')).toHaveTextContent('false');
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    expect(screen.getByTestId('panel-open')).toHaveTextContent('true');
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    expect(screen.getByTestId('panel-open')).toHaveTextContent('false');
  });
});
