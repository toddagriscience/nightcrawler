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

/** Renders the modal's open state so the button can be asserted. */
function ModalState() {
  const { modalOpen } = useSearchPanel();
  return <span data-testid="modal-open">{String(modalOpen)}</span>;
}

function renderButton() {
  return render(
    <SearchPanelProvider>
      <SidebarSearchButton />
      <ModalState />
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

  it('opens the search popup when clicked', () => {
    renderButton();
    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    expect(screen.getByTestId('modal-open')).toHaveTextContent('true');
  });
});
