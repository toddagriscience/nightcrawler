// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CircleAlert, CircleCheckBig, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/lib/order/hooks';
import type { OrderItem } from '@/lib/order/types';
import { getOrderCheckoutSessionStatus } from '../actions';
import type { OrderCheckoutModalState } from '../types';
import { OrderCheckoutModal } from './order-checkout-modal';
import { OrderLineItemCard } from './order-line-item-card';
import { OrderSummaryCard } from './order-summary-card';

/**
 * Client order page that renders the local-storage-backed shopping cart.
 *
 * @returns {JSX.Element} Order review and embedded checkout experience.
 */
export function OrderClient() {
  const { order, itemCount, subtotal, updateQuantity, removeItem, clear } =
    useOrder();
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Browser-safe Stripe publishable key used for the embedded checkout flow. */
  const stripePublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;
  /** Controls whether the checkout modal is visible. */
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  /** Current checkout phase shown inside the modal. */
  const [checkoutModalState, setCheckoutModalState] =
    useState<OrderCheckoutModalState>('checkout');
  /** Frozen order snapshot used to create the current Stripe checkout session. */
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);
  /** Recoverable checkout error shown inside the modal. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** Replaces the empty-order state after checkout finishes or fails. */
  const [pageState, setPageState] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  /** Prevents the same returned Stripe session from being processed repeatedly. */
  const processedSessionIdRef = useRef<string | null>(null);
  const isCheckoutLocked =
    isCheckoutOpen &&
    (checkoutModalState === 'checkout' || checkoutModalState === 'loading');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId || processedSessionIdRef.current === sessionId) {
      return;
    }

    /** Stable checkout-session id for the lifetime of this effect run. */
    const checkoutSessionId = sessionId;
    processedSessionIdRef.current = sessionId;
    /** Prevents state updates after this effect is cleaned up or replaced. */
    let isActive = true;

    /**
     * Resolves the current Stripe Checkout Session status from the return URL.
     *
     * @returns {Promise<void>} Resolves after the checkout modal state is updated.
     */
    async function resolveReturnedCheckoutSession() {
      setIsCheckoutOpen(true);
      setCheckoutModalState('loading');
      setErrorMessage(null);

      const result = await getOrderCheckoutSessionStatus(checkoutSessionId);

      if (!isActive) {
        return;
      }

      if (result.error) {
        setErrorMessage(result.error);
        setPageState('error');
        setIsCheckoutOpen(false);
        router.replace('/order');
        return;
      }

      if (result.status === 'complete') {
        clear();
        setPageState('success');
        setIsCheckoutOpen(false);
        router.replace('/order');
        return;
      }

      setErrorMessage(
        'Your checkout did not complete. Review your order and try again when you are ready.'
      );
      setPageState('error');
      setIsCheckoutOpen(false);
      router.replace('/order');
    }

    resolveReturnedCheckoutSession();

    return () => {
      isActive = false;
    };
  }, [clear, router, searchParams]);

  /**
   * Starts embedded checkout with a frozen snapshot of the current order.
   *
   * @returns {void}
   */
  function handleCheckoutStart() {
    setPageState('idle');

    if (order.items.length === 0) {
      setErrorMessage('Your order is empty. Add products before checking out.');
      setPageState('error');
      return;
    }

    if (!stripePublishableKey) {
      setErrorMessage(
        'Stripe is not configured yet. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY before accepting payments.'
      );
      setPageState('error');
      return;
    }

    setCheckoutItems(order.items);
    setErrorMessage(null);
    setCheckoutModalState('checkout');
    setIsCheckoutOpen(true);
  }

  /**
   * Resets transient checkout state when the modal closes.
   *
   * @param {boolean} nextOpen - Next dialog visibility.
   * @returns {void}
   */
  function handleCheckoutOpenChange(nextOpen: boolean) {
    setIsCheckoutOpen(nextOpen);

    if (!nextOpen) {
      setCheckoutModalState('checkout');
      setErrorMessage(null);
    }
  }

  /**
   * Applies the successful checkout transition inside the modal.
   *
   * @returns {void}
   */
  function handleCheckoutSuccess() {
    setErrorMessage(null);
    clear();
    setPageState('success');
    setIsCheckoutOpen(false);
  }

  return (
    <>
      {/* Success State */}
      {pageState === 'success' ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:py-28">
          {/* Success Icon */}
          <div className="relative mb-2">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/50">
              <CircleCheckBig className="size-10 text-emerald-600" />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border border-emerald-200/30 scale-110 pointer-events-none" />
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground">
            Order received
          </h1>

          {/* Message */}
          <p className="mt-4 max-w-sm text-base leading-relaxed text-foreground/60">
            Your seed order has been submitted successfully. A Todd advisor will
            follow up with you shortly to confirm fulfillment.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="brand"
              className="gap-2"
              onClick={() => {
                setPageState('idle');
              }}
            >
              Continue shopping
              <ArrowRight className="size-4" />
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">Browse seeds</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {/* Error State */}
      {pageState === 'error' ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:py-28">
          {/* Error Icon */}
          <div className="relative mb-2">
            <div className="flex size-20 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-200/50">
              <CircleAlert className="size-10 text-red-500" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground">
            Checkout unavailable
          </h1>

          {/* Message */}
          <p className="mt-4 max-w-sm text-base leading-relaxed text-foreground/60">
            {errorMessage ??
              'We could not complete checkout right now. Please try again in a moment.'}
          </p>

          {/* Action */}
          <div className="mt-10">
            <Button
              type="button"
              variant="brand"
              onClick={() => {
                setErrorMessage(null);
                setPageState('idle');
              }}
            >
              Back to order
            </Button>
          </div>
        </div>
      ) : null}

      {/* Empty State */}
      {pageState === 'idle' && order.items.length === 0 ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:py-28">
          {/* Decorative Icon */}
          <div className="relative mb-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-stone-100 ring-1 ring-stone-200/50">
              <Package className="size-9 text-stone-400" />
            </div>
            {/* Subtle seed/sparkle accents */}
            <div className="absolute -top-1 -right-2 size-2 rounded-full bg-amber-300/60" />
            <div className="absolute -bottom-1 -left-3 size-1.5 rounded-full bg-emerald-400/50" />
            <div className="absolute top-1/2 -right-4 size-1 rounded-full bg-stone-300/70" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Your order is empty
          </h1>

          {/* Message */}
          <p className="mt-3 max-w-xs text-base leading-relaxed text-foreground/50">
            Browse our curated seed selection to find varieties suited for your
            growing conditions.
          </p>

          {/* Action */}
          <Button asChild variant="brand" className="mt-8 gap-2">
            <Link href="/search">
              Explore seeds
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : null}

      {/* Order Items + Summary */}
      {pageState === 'idle' && order.items.length > 0 ? (
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            {/* Items Section */}
            <section className="space-y-4">
              {/* Section Header */}
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Your order
                </h1>
                <p className="mt-2 text-sm text-foreground/50">
                  Review your selected seed products before checkout
                </p>
              </div>

              {/* Line Items */}
              {order.items.map((item) => (
                <OrderLineItemCard
                  key={item.slug}
                  item={item}
                  isCheckoutLocked={isCheckoutLocked}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              ))}
            </section>

            {/* Summary Sidebar */}
            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={subtotal}
              isCheckoutLocked={isCheckoutLocked}
              onCheckout={handleCheckoutStart}
              onClear={clear}
            />
          </div>
        </div>
      ) : null}

      {/* Checkout Modal */}
      <OrderCheckoutModal
        isOpen={isCheckoutOpen}
        onOpenChange={handleCheckoutOpenChange}
        modalState={checkoutModalState}
        checkoutItems={checkoutItems}
        onErrorChange={setErrorMessage}
        onPaymentSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
