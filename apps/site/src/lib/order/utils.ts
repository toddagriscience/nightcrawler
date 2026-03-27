// Copyright © Todd Agriscience, Inc. All rights reserved.

import logger from '@/lib/logger';
import type { AddOrderItemInput, OrderState } from './types';

/** Local storage key used for persisting the client-side order. */
export const ORDER_STORAGE_KEY = 'nightcrawler-order';
/** Browser event name emitted whenever the local order changes. */
export const ORDER_UPDATED_EVENT = 'nightcrawler-order-updated';

/** Empty order snapshot used for SSR-safe initialization. */
const EMPTY_ORDER: OrderState = {
  items: [],
  updatedAt: null,
};

/**
 * Returns whether the current runtime can access browser storage APIs.
 *
 * @returns {boolean} Whether the code is running in a browser.
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Creates a persisted order snapshot with an updated timestamp.
 *
 * @param {OrderState} order - The order state to snapshot.
 * @returns {OrderState} The timestamped order snapshot.
 */
function createOrderSnapshot(order: OrderState): OrderState {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Returns an empty order snapshot for deterministic initial rendering.
 *
 * @returns {OrderState} The empty order state.
 */
export function getEmptyOrder(): OrderState {
  return EMPTY_ORDER;
}

/**
 * Reads the order from local storage, falling back to an empty order when
 * storage is unavailable or malformed.
 */
export function readOrder(): OrderState {
  if (!isBrowser()) {
    return EMPTY_ORDER;
  }

  const rawOrder = window.localStorage.getItem(ORDER_STORAGE_KEY);

  if (!rawOrder) {
    return EMPTY_ORDER;
  }

  try {
    const parsedOrder = JSON.parse(rawOrder) as OrderState;

    if (!Array.isArray(parsedOrder.items)) {
      return EMPTY_ORDER;
    }

    return {
      items: parsedOrder.items,
      updatedAt: parsedOrder.updatedAt ?? null,
    };
  } catch (error) {
    logger.error('[Order] Failed to parse local order:', error);
    return EMPTY_ORDER;
  }
}

function persistOrder(order: OrderState): OrderState {
  if (!isBrowser()) {
    return order;
  }

  const nextOrder = createOrderSnapshot(order);
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrder));
  window.dispatchEvent(new Event(ORDER_UPDATED_EVENT));
  return nextOrder;
}

/**
 * Adds a seed product to the local order, merging quantities by slug.
 */
export function addOrderItem(input: AddOrderItemInput): OrderState {
  const currentOrder = readOrder();
  const nextQuantity = Math.max(1, input.quantity ?? 1);
  const existingItem = currentOrder.items.find(
    (item) => item.slug === input.slug
  );

  if (!existingItem) {
    return persistOrder({
      ...currentOrder,
      items: [
        ...currentOrder.items,
        {
          ...input,
          quantity: Math.min(nextQuantity, input.stock),
        },
      ],
    });
  }

  return persistOrder({
    ...currentOrder,
    items: currentOrder.items.map((item) =>
      item.slug === input.slug
        ? {
            ...item,
            quantity: Math.min(item.quantity + nextQuantity, item.stock),
          }
        : item
    ),
  });
}

/**
 * Updates the quantity of an existing order item, removing it if the new
 * quantity is zero or lower.
 */
export function updateOrderItemQuantity(
  slug: string,
  quantity: number
): OrderState {
  const currentOrder = readOrder();
  const item = currentOrder.items.find((entry) => entry.slug === slug);

  if (!item) {
    return currentOrder;
  }

  if (quantity <= 0) {
    return removeOrderItem(slug);
  }

  return persistOrder({
    ...currentOrder,
    items: currentOrder.items.map((entry) =>
      entry.slug === slug
        ? { ...entry, quantity: Math.min(quantity, entry.stock) }
        : entry
    ),
  });
}

/**
 * Removes a single item from the local order.
 */
export function removeOrderItem(slug: string): OrderState {
  const currentOrder = readOrder();

  return persistOrder({
    ...currentOrder,
    items: currentOrder.items.filter((item) => item.slug !== slug),
  });
}

/**
 * Clears the entire local order.
 */
export function clearOrder(): OrderState {
  return persistOrder(EMPTY_ORDER);
}

/**
 * Returns the total number of units across all order items.
 */
export function getOrderItemCount(order: OrderState): number {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Returns the order subtotal in cents.
 */
export function getOrderSubtotal(order: OrderState): number {
  return order.items.reduce(
    (total, item) => total + item.quantity * item.priceInCents,
    0
  );
}

/**
 * Formats a cent-based USD amount for display.
 */
export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100);
}

/**
 * Subscribes to local order changes from this tab and other tabs.
 */
export function subscribeToOrderChanges(onChange: () => void): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === ORDER_STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(ORDER_UPDATED_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(ORDER_UPDATED_EVENT, onChange);
  };
}
