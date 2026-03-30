// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
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
      {pageState === 'success' ? (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CircleCheckBig className="size-8" />
            </div>
            <h1 className="mt-6 text-center text-3xl font-semibold text-foreground">
              Payment received
            </h1>
            <p className="mt-3 text-center text-base leading-relaxed text-foreground/70">
              Your seed order has been submitted successfully.
            </p>
            <p className="mt-3 text-center text-base leading-relaxed text-foreground/70">
              The Todd team has been notified internally and will follow up with
              you soon to confirm fulfillment and next steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="brand"
                onClick={() => {
                  setPageState('idle');
                }}
              >
                Continue
              </Button>
              <Button asChild variant="outline">
                <Link href="/search">Browse products</Link>
              </Button>
            </div>
          </section>
        </div>
      ) : pageState === 'error' ? (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-700">
              <CircleAlert className="size-8" />
            </div>
            <h1 className="mt-6 text-center text-3xl font-semibold text-foreground">
              Checkout unavailable
            </h1>
            <p className="mt-3 text-center text-base leading-relaxed text-foreground/70">
              {errorMessage ??
                'We could not complete checkout right now. Please try again in a moment.'}
            </p>
            <div className="mt-8 flex justify-center">
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
          </section>
        </div>
      ) : order.items.length === 0 ? (
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold text-foreground">
            Your order is empty
          </h1>
          <p className="mt-3 text-foreground/70">
            Add seed products from search or a product detail page to start an
            order.
          </p>
          <Button asChild variant="brand" className="mt-6">
            <Link href="/search">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="space-y-4">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">
                  Order
                </h1>
                <p className="mt-2 text-foreground/70">
                  Review your selected seed products before checkout.
                </p>
              </div>

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

            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={subtotal}
              isCheckoutLocked={isCheckoutLocked}
              onCheckout={handleCheckoutStart}
              onClear={clear}
            />
          </div>
        </div>
      )}

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
