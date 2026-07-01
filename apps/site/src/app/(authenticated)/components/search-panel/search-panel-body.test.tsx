// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchPanelBody } from './search-panel-body';
import { SearchPanelProvider, useSearchPanel } from './search-panel-context';

const getSearchModalData = vi.fn();

vi.mock('@/app/(authenticated)/actions/search-modal', () => ({
  getSearchModalData: () => getSearchModalData(),
}));

const sampleImps = [
  {
    id: 1,
    title: 'Tomato Blight Control',
    category: 'Disease',
    content: 'Manage blight with resistant varieties and rotation.',
    slug: 'tomato-blight',
  },
];

const sampleSeeds = [
  {
    id: 10,
    name: 'Roma Tomato',
    description: 'Classic paste tomato',
    slug: 'roma-tomato',
    priceInCents: 500,
    unit: 'packet',
    stock: 20,
    imageUrl: null,
  },
];

/** Opens the panel on mount so the body loads its data. */
function AutoOpen() {
  const { openPanel } = useSearchPanel();
  return (
    <button type="button" onClick={openPanel}>
      open-panel
    </button>
  );
}

function renderBody() {
  return render(
    <SearchPanelProvider>
      <AutoOpen />
      <SearchPanelBody />
    </SearchPanelProvider>
  );
}

beforeEach(() => {
  getSearchModalData.mockResolvedValue({
    imps: sampleImps,
    seeds: sampleSeeds,
  });
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('SearchPanelBody', () => {
  it('loads and lists IMPs when the panel opens', async () => {
    renderBody();
    fireEvent.click(screen.getByRole('button', { name: 'open-panel' }));
    expect(
      await screen.findByText('Tomato Blight Control')
    ).toBeInTheDocument();
  });

  it('filters results as the user types', async () => {
    renderBody();
    fireEvent.click(screen.getByRole('button', { name: 'open-panel' }));
    await screen.findByText('Tomato Blight Control');

    fireEvent.change(screen.getByPlaceholderText(/Search IMPs/i), {
      target: { value: 'nonsense-query' },
    });
    expect(screen.queryByText('Tomato Blight Control')).not.toBeInTheDocument();
    expect(screen.getByText(/No IMPs found/i)).toBeInTheDocument();
  });

  it('switches to the seeds tab and lists seed products', async () => {
    renderBody();
    fireEvent.click(screen.getByRole('button', { name: 'open-panel' }));
    await screen.findByText('Tomato Blight Control');

    fireEvent.click(screen.getByRole('button', { name: /Browse Seeds/i }));
    expect(await screen.findByText('Roma Tomato')).toBeInTheDocument();
  });
});
