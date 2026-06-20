// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/order/utils';
import type { OrderSummaryCardProps } from '../types';

/**
 * Renders the order summary sidebar and checkout actions.
 *
 * @param {OrderSummaryCardProps} props - Summary totals and action handlers.
 * @returns {JSX.Element} Order summary sidebar.
 */
export function OrderSummaryCard({
  itemCount,
  subtotal,
  isCheckoutLocked,
  onCheckout,
  onClear,
}: OrderSummaryCardProps) {
  return (
    <aside className="h-max rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-foreground/70">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold text-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="text-sm text-foreground/60">
          Taxes, shipping, and final fulfillment are not calculated yet.
        </p>

        {isCheckoutLocked ? (
          <p className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-foreground/70">
            Checkout is using your current order snapshot. Close the modal to
            make changes.
          </p>
        ) : null}

        <Button
          type="button"
          variant="brand"
          className="w-full"
          onClick={onCheckout}
          disabled={isCheckoutLocked}
        >
          Checkout
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onClear}
          disabled={isCheckoutLocked}
        >
          Clear order
        </Button>
      </div>
    </aside>
  );
}
