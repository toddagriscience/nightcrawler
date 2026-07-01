// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ZoneSearchForm } from './zone-search-form';
import {
  SearchPanelProvider,
  useSearchPanel,
} from '@/app/(authenticated)/components/search-panel/search-panel-context';

/** Exposes the panel's open state and seeded query for assertions. */
function PanelState() {
  const { open, initialQuery } = useSearchPanel();
  return (
    <span data-testid="state">
      {String(open)}:{initialQuery}
    </span>
  );
}

function renderForm() {
  return render(
    <SearchPanelProvider>
      <ZoneSearchForm />
      <PanelState />
    </SearchPanelProvider>
  );
}

describe('ZoneSearchForm', () => {
  it('opens the search panel seeded with the trimmed query on submit', () => {
    renderForm();
    expect(screen.getByTestId('state')).toHaveTextContent('false:');

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: '  soil pH  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ask/i }));

    expect(screen.getByTestId('state')).toHaveTextContent('true:soil pH');
  });
});
