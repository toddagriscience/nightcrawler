// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchModal } from './search-modal';

const imps = [
  {
    id: 1,
    title: 'Soil Health Plan',
    category: 'soil',
    slug: 'soil-health',
    content: 'long content',
  },
];
const seeds = [
  {
    id: 's1',
    name: 'Crimson Clover',
    description: 'cover crop',
    priceInCents: 500,
    unit: 'lb',
  },
];

vi.mock('@/app/(authenticated)/actions/search-modal', () => ({
  getSearchModalData: vi.fn(async () => ({ imps, seeds })),
}));

describe('SearchModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <SearchModal isOpen={false} onClose={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('loads and shows IMPs on the default tab when open', async () => {
    render(<SearchModal isOpen onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText('Soil Health Plan')).toBeInTheDocument();
  });

  it('filters IMPs by the query', async () => {
    render(<SearchModal isOpen onClose={() => {}} />);
    await screen.findByText('Soil Health Plan');

    fireEvent.change(screen.getByPlaceholderText(/Search IMPs and seeds/i), {
      target: { value: 'nonexistent' },
    });

    expect(screen.queryByText('Soil Health Plan')).not.toBeInTheDocument();
    expect(screen.getByText('No IMPs found')).toBeInTheDocument();
  });

  it('switches to the Seeds tab and adds a seed to the order', async () => {
    render(<SearchModal isOpen onClose={() => {}} />);
    await screen.findByText('Soil Health Plan');

    fireEvent.click(screen.getByRole('button', { name: /Browse Seeds/i }));
    expect(screen.getByText('Crimson Clover')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Add to order/i }));
    expect(screen.getByRole('button', { name: /Added/i })).toBeInTheDocument();
    expect(screen.getByText(/1 item/i)).toBeInTheDocument();
  });

  it('closes on Escape and on backdrop click', async () => {
    const onClose = vi.fn();
    const { container } = render(<SearchModal isOpen onClose={onClose} />);
    await screen.findByText('Soil Health Plan');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Backdrop is the first absolute-inset overlay inside the dialog.
    const backdrop = container.querySelector('.bg-black\\/60');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
