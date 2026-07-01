// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchPanelBody } from './search-panel-body';
import { SearchPanelProvider, useSearchPanel } from './search-panel-context';

const runInferenceSearch = vi.fn();

vi.mock('@/app/(authenticated)/actions/inference-search', () => ({
  runInferenceSearch: (query: string) => runInferenceSearch(query),
}));

const sampleResults = [
  {
    id: 1,
    title: 'Tomato Blight Control',
    slug: 'tomato-blight',
    content: 'Manage blight with resistant varieties and rotation.',
    source: null,
    category: 'Disease',
    resultType: 'imp' as const,
    similarity: 0.9,
    stock: null,
    priceInCents: null,
    unit: null,
  },
];

/** Submits a search on mount so the body loads its data. */
function AutoSearch() {
  const { submitSearch } = useSearchPanel();
  return (
    <button type="button" onClick={() => submitSearch('tomato blight')}>
      run-search
    </button>
  );
}

function renderBody() {
  return render(
    <SearchPanelProvider>
      <AutoSearch />
      <SearchPanelBody />
    </SearchPanelProvider>
  );
}

beforeEach(() => {
  runInferenceSearch.mockResolvedValue(sampleResults);
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('SearchPanelBody', () => {
  it('loads and lists inference search results', async () => {
    renderBody();
    fireEvent.click(screen.getByRole('button', { name: 'run-search' }));

    expect(
      await screen.findByText('Tomato Blight Control')
    ).toBeInTheDocument();
    expect(runInferenceSearch).toHaveBeenCalledWith('tomato blight');
  });

  it('submits a follow-up question from the bottom search bar', async () => {
    renderBody();
    fireEvent.click(screen.getByRole('button', { name: 'run-search' }));
    await screen.findByText('Tomato Blight Control');

    runInferenceSearch.mockResolvedValueOnce([
      {
        ...sampleResults[0],
        id: 2,
        title: 'Soil pH Management',
        slug: 'soil-ph',
      },
    ]);

    fireEvent.change(
      screen.getByRole('textbox', { name: /Follow-up question/i }),
      { target: { value: 'soil pH' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /^Search$/i }));

    await waitFor(() => {
      expect(runInferenceSearch).toHaveBeenCalledWith('soil pH');
    });
  });
});
