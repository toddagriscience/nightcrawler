// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
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
    <aside className="h-max overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-stone-100 bg-stone-50/50 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-foreground/5">
            <ShoppingBag className="size-4 text-foreground/70" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Order Summary
            </h2>
            <p className="text-xs text-foreground/50">
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 md:p-6">
        <div className="space-y-4">
          {/* Subtotal Row */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-foreground/60">Subtotal</span>
            <span className="text-xl font-semibold text-foreground tabular-nums">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Fulfillment Note */}
          <p className="rounded-xl border border-stone-100 bg-stone-50/50 px-4 py-3 text-xs leading-relaxed text-foreground/50">
            Taxes, shipping, and final fulfillment are calculated during
            checkout.
          </p>

          {/* Checkout Locked Notice */}
          {isCheckoutLocked ? (
            <p className="rounded-xl border border-amber-200/50 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-700/80">
              Checkout is using your current order snapshot. Close the modal to
              make changes.
            </p>
          ) : null}

          {/* Checkout Button */}
          <Button
            type="button"
            variant="brand"
            className="w-full gap-2 py-2.5 text-sm font-medium"
            onClick={onCheckout}
            disabled={isCheckoutLocked}
          >
            Proceed to Checkout
            <ArrowRight className="size-4" />
          </Button>

          {/* Clear Order Button */}
          <Button
            type="button"
            variant="ghost"
            className="w-full gap-1.5 py-2 text-xs text-stone-400 transition-colors hover:text-red-600 disabled:opacity-40"
            onClick={onClear}
            disabled={isCheckoutLocked}
          >
            <Trash2 className="size-3.5" />
            Clear order
          </Button>
        </div>
      </div>
    </aside>
  );
}
