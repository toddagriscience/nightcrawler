// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchFloatingButton from './search-floating-button';

vi.mock('@/components/common/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/app/(authenticated)/actions/search-modal', () => ({
  getSearchModalData: vi.fn(async () => ({ imps: [], seeds: [] })),
}));

describe('SearchFloatingButton', () => {
  it('renders the floating search button with no modal initially', () => {
    render(<SearchFloatingButton />);
    expect(
      screen.getByRole('button', { name: /Open search/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the search modal when clicked', () => {
    render(<SearchFloatingButton />);
    fireEvent.click(screen.getByRole('button', { name: /Open search/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
