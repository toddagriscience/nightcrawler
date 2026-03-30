// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
import type { AddOrderItemInput, OrderState } from './types';
import {
  addOrderItem,
  clearOrder,
  getEmptyOrder,
  getOrderItemCount,
  getOrderSubtotal,
  readOrder,
  removeOrderItem,
  subscribeToOrderChanges,
  updateOrderItemQuantity,
} from './utils';

/**
 * Client hook for working with the local-storage-backed order state.
 */
export function useOrder() {
  const [order, setOrder] = useState<OrderState>(getEmptyOrder);

  useEffect(() => {
    /**
     * Synchronizes the in-memory order state with local storage after mount.
     *
     * @returns {void}
     */
    function syncOrder() {
      setOrder(readOrder());
    }

    syncOrder();

    return subscribeToOrderChanges(() => {
      setOrder(readOrder());
    });
  }, []);

  return {
    order,
    itemCount: getOrderItemCount(order),
    subtotal: getOrderSubtotal(order),
    addItem(input: AddOrderItemInput) {
      setOrder(addOrderItem(input));
    },
    updateQuantity(slug: string, quantity: number) {
      setOrder(updateOrderItemQuantity(slug, quantity));
    },
    removeItem(slug: string) {
      setOrder(removeOrderItem(slug));
    },
    clear() {
      setOrder(clearOrder());
    },
  };
}
