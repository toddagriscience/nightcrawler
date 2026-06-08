// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { LoaderCircle, Lock } from 'lucide-react';
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
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-2xl border-stone-200 p-0 shadow-2xl sm:max-w-5xl data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100">
        {/* Loading State */}
        {modalState === 'loading' ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="relative">
              <LoaderCircle
                className="size-10 animate-spin text-foreground/30"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">
                Confirming your order...
              </p>
              <p className="mt-1 text-sm text-foreground/50">
                This will only take a moment
              </p>
            </div>
          </div>
        ) : null}

        {/* Checkout State */}
        {modalState === 'checkout' ? (
          <>
            {/* Modal Header */}
            <div className="border-b border-stone-100 bg-gradient-to-r from-stone-50 via-white to-stone-50 px-6 py-5 sm:px-8 sm:py-6">
              <DialogHeader className="text-left">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-foreground/5">
                    <Lock className="size-4 text-foreground/60" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-foreground">
                      Secure Checkout
                    </DialogTitle>
                    <DialogDescription className="mt-0.5 text-sm text-foreground/50">
                      Complete payment to submit your seed order
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {stripePublishableKey ? (
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50/50">
                  <OrderEmbeddedCheckout
                    checkoutItems={checkoutItems}
                    onPaymentSuccess={onPaymentSuccess}
                    onErrorChange={onErrorChange}
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-red-200/50 bg-red-50/50 px-5 py-4">
                  <p className="text-sm font-medium text-red-700">
                    Stripe is not configured yet
                  </p>
                  <p className="mt-1 text-xs text-red-600/80">
                    Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable payments
                  </p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
