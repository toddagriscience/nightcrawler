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
    id: 1,
    name: 'Crimson Clover',
    slug: 'crimson-clover',
    description: 'cover crop',
    stock: 8,
    priceInCents: 500,
    unit: 'lb',
    imageUrl: null,
  },
];

const { mockAddItem } = vi.hoisted(() => ({ mockAddItem: vi.fn() }));

vi.mock('@/app/(authenticated)/actions/search-modal', () => ({
  getSearchModalData: vi.fn(async () => ({ imps, seeds })),
}));

vi.mock('@/lib/order/hooks', () => ({
  useOrder: () => ({
    order: { items: [], updatedAt: null },
    itemCount: 0,
    addItem: mockAddItem,
  }),
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

  it('switches to the Seeds tab and adds a seed to the real cart', async () => {
    mockAddItem.mockClear();
    render(<SearchModal isOpen onClose={() => {}} />);
    await screen.findByText('Soil Health Plan');

    fireEvent.click(screen.getByRole('button', { name: /Browse Seeds/i }));
    await waitFor(() =>
      expect(screen.getByText('Crimson Clover')).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: /Add to order/i }));

    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith({
      seedProductId: 1,
      slug: 'crimson-clover',
      name: 'Crimson Clover',
      description: 'cover crop',
      stock: 8,
      imageUrl: null,
      unit: 'lb',
      priceInCents: 500,
    });
  });

  it('shows the IMP content preview when a result is expanded', async () => {
    render(<SearchModal isOpen onClose={() => {}} />);
    const title = await screen.findByText('Soil Health Plan');

    // Preview content is hidden until the IMP row is expanded.
    expect(screen.queryByText('long content')).not.toBeInTheDocument();

    fireEvent.click(title);

    expect(screen.getByText('long content')).toBeInTheDocument();
  });

  it('focuses the input on open and restores focus to the trigger on close', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const onClose = vi.fn();
    const { rerender } = render(<SearchModal isOpen onClose={onClose} />);
    await screen.findByText('Soil Health Plan');

    // Opening the modal moves focus into the search input.
    expect(document.activeElement).toBe(
      screen.getByPlaceholderText(/Search IMPs and seeds/i)
    );

    // Closing the modal restores focus to the previously focused trigger.
    rerender(<SearchModal isOpen={false} onClose={onClose} />);
    expect(document.activeElement).toBe(trigger);

    document.body.removeChild(trigger);
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
