// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { OrderCheckoutModalProps } from '../types';
import { OrderEmbeddedCheckout } from './order-embedded-checkout';

/**
 * Modal wrapper for embedded Stripe checkout and its completion states.
 *
 * @param {OrderCheckoutModalProps} props - Modal state, order summary, and callbacks.
 * @returns {JSX.Element} Checkout modal for the authenticated `/order` page.
 */
export function OrderCheckoutModal({
  isOpen,
  onOpenChange,
  modalState,
  checkoutItems,
  onErrorChange,
  onPaymentSuccess,
}: OrderCheckoutModalProps) {
  /** Browser-safe Stripe publishable key used for the embedded checkout flow. */
  const stripePublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 max-h-[90vh] gap-6 overflow-y-auto rounded-3xl border-stone-200 p-0 shadow-2xl sm:max-w-5xl">
        <div className="bg-gradient-to-br from-stone-50 via-white to-stone-100 p-6 sm:p-8">
          {modalState === 'loading' ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center text-sm text-foreground/70">
              <LoaderCircle
                className="size-6 animate-spin"
                aria-hidden="true"
              />
              <p>Confirming your checkout...</p>
            </div>
          ) : null}

          {modalState === 'checkout' ? (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-semibold text-foreground">
                  Checkout
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed text-foreground/70">
                  Complete payment below to submit your seed order. A Todd
                  advisor will follow up afterwards.{' '}
                </DialogDescription>
              </DialogHeader>

              {stripePublishableKey ? (
                <OrderEmbeddedCheckout
                  checkoutItems={checkoutItems}
                  onPaymentSuccess={onPaymentSuccess}
                  onErrorChange={onErrorChange}
                />
              ) : (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Stripe is not configured yet
                </p>
              )}
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
