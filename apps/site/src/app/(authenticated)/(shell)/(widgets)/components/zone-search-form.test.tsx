// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ZoneSearchForm } from './zone-search-form';
import {
  SearchPanelProvider,
  useSearchPanel,
} from '@/app/(authenticated)/components/search-panel/search-panel-context';

/** Exposes the panel's open state and active query for assertions. */
function PanelState() {
  const { open, activeQuery, isSearching } = useSearchPanel();
  return (
    <span data-testid="state">
      {String(open)}:{activeQuery}:{String(isSearching)}
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
  it('opens the search panel and submits the trimmed query', () => {
    renderForm();
    expect(screen.getByTestId('state')).toHaveTextContent('false::false');

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: '  soil pH  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ask/i }));

    expect(screen.getByTestId('state')).toHaveTextContent('true:soil pH:true');
  });
});
