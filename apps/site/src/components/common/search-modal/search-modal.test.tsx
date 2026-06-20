// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const { mockAddItem, mockRemoveItem, mockGetSearchModalData, mockOrderItems } =
  vi.hoisted(() => ({
    mockAddItem: vi.fn(),
    mockRemoveItem: vi.fn(),
    mockGetSearchModalData: vi.fn(),
    mockOrderItems: [] as { slug: string }[],
  }));

vi.mock('@/app/(authenticated)/actions/search-modal', () => ({
  getSearchModalData: mockGetSearchModalData,
}));

vi.mock('@/lib/order/hooks', () => ({
  useOrder: () => ({
    order: { items: mockOrderItems, updatedAt: null },
    itemCount: mockOrderItems.length,
    addItem: mockAddItem,
    removeItem: mockRemoveItem,
  }),
}));

describe('SearchModal', () => {
  beforeEach(() => {
    mockGetSearchModalData.mockReset();
    mockGetSearchModalData.mockResolvedValue({ imps, seeds });
    mockOrderItems.length = 0;
    document.body.style.overflow = '';
  });

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

    fireEvent.change(screen.getByPlaceholderText(/Search IMPs/i), {
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
      screen.getByPlaceholderText(/Search IMPs/i)
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
    const backdrop = container.querySelector('.bg-black\\/20');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('shows an error message when loading the data rejects', async () => {
    mockGetSearchModalData.mockRejectedValue(new Error('boom'));

    render(<SearchModal isOpen onClose={() => {}} />);

    expect(
      await screen.findByText(/Something went wrong loading results/i)
    ).toBeInTheDocument();
    // Result lists are not shown alongside the error.
    expect(screen.queryByText('Soil Health Plan')).not.toBeInTheDocument();
  });

  it('ignores a stale response that resolves after close', async () => {
    let resolveData: (value: {
      imps: typeof imps;
      seeds: typeof seeds;
    }) => void;
    mockGetSearchModalData.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveData = resolve;
        })
    );

    const { rerender } = render(<SearchModal isOpen onClose={() => {}} />);
    // Close before the in-flight request resolves.
    rerender(<SearchModal isOpen={false} onClose={() => {}} />);
    // Now the original request resolves with stale data.
    resolveData!({ imps, seeds });

    await waitFor(() => Promise.resolve());

    // Reopen with no data source so we can observe that the stale result was
    // never committed (the lists would otherwise render the IMP).
    mockGetSearchModalData.mockResolvedValue({ imps: [], seeds: [] });
    rerender(<SearchModal isOpen onClose={() => {}} />);

    await waitFor(() =>
      expect(screen.getByText('No IMPs found')).toBeInTheDocument()
    );
    expect(screen.queryByText('Soil Health Plan')).not.toBeInTheDocument();
  });

  it('uses a tab-specific placeholder and leaves the page scrollable', async () => {
    render(<SearchModal isOpen onClose={() => {}} />);
    await screen.findByText('Soil Health Plan');

    // IMPs is the default tab, so the placeholder scopes to IMPs only.
    expect(screen.getByPlaceholderText('Search IMPs...')).toBeInTheDocument();

    // The modal no longer locks body scroll, so the page behind can scroll.
    expect(document.body.style.overflow).toBe('');

    // Switching to the Seeds tab updates the placeholder to scope to seeds.
    fireEvent.click(screen.getByRole('button', { name: /Browse Seeds/i }));
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Search seeds...')).toBeInTheDocument()
    );
  });

  it('toggles a seed between add and remove in the cart', async () => {
    mockAddItem.mockClear();
    mockRemoveItem.mockClear();
    // Start with the seed already in the order so the button is in the
    // "Added" state and should remove on click.
    mockOrderItems.length = 0;
    mockOrderItems.push({ slug: 'crimson-clover' });

    render(<SearchModal isOpen onClose={() => {}} />);
    await screen.findByText('Soil Health Plan');

    fireEvent.click(screen.getByRole('button', { name: /Browse Seeds/i }));
    await waitFor(() =>
      expect(screen.getByText('Crimson Clover')).toBeInTheDocument()
    );

    // The toggle button reflects the added state and removes on click.
    const toggle = screen.getByRole('button', { name: /Added|Remove/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);

    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    expect(mockRemoveItem).toHaveBeenCalledWith('crimson-clover');
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('traps Tab focus within the modal', async () => {
    render(<SearchModal isOpen onClose={() => {}} />);
    await screen.findByText('Soil Health Plan');

    const focusable = Array.from(
      screen
        .getByRole('dialog')
        .querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Tab from the last element wraps to the first.
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    // Shift+Tab from the first element wraps to the last.
    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
