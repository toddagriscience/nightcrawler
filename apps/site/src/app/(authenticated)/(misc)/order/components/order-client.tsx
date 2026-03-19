// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/lib/order/hooks';
import type { OrderItem } from '@/lib/order/types';
import { formatPrice } from '@/lib/order/utils';
import { getOrderCheckoutSessionStatus } from '../actions';
import type { OrderCheckoutModalState, OrderClientProps } from '../types';
import { OrderCheckoutModal } from './order-checkout-modal';

/**
 * Client order page that renders the local-storage-backed shopping cart.
 *
 * @param {OrderClientProps} props - Server-provided Stripe configuration.
 * @returns {JSX.Element} Order review and embedded checkout experience.
 */
export function OrderClient({ stripePublishableKey }: OrderClientProps) {
  const { order, itemCount, subtotal, updateQuantity, removeItem, clear } =
    useOrder();
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Controls whether the checkout modal is visible. */
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  /** Current checkout phase shown inside the modal. */
  const [checkoutModalState, setCheckoutModalState] =
    useState<OrderCheckoutModalState>('checkout');
  /** Frozen order snapshot used to create the current Stripe checkout session. */
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);
  /** Recoverable checkout error shown inside the modal. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** Customer email returned from a completed Stripe Checkout Session. */
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
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

    if (!sessionId) {
      return;
    }

    if (processedSessionIdRef.current === sessionId) {
      return;
    }

    processedSessionIdRef.current = sessionId;
    const returnedSessionId = sessionId;
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

      const result = await getOrderCheckoutSessionStatus(returnedSessionId);

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
        setCustomerEmail(result.customerEmail);
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
    setCustomerEmail(null);
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
      setCustomerEmail(null);
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
              {customerEmail
                ? ` A confirmation email will be sent to ${customerEmail}.`
                : ''}
            </p>
            <p className="mt-3 text-center text-base leading-relaxed text-foreground/70">
              A Todd advisor will follow up with you soon to confirm fulfillment
              and next steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="brand"
                onClick={() => {
                  setCustomerEmail(null);
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
                <article
                  key={item.slug}
                  className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[8rem_minmax(0,1fr)_auto]"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative block aspect-square overflow-hidden rounded-2xl bg-stone-100"
                  >
                    <Image
                      src={item.imageUrl || '/seed-placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </Link>

                  <div className="space-y-2">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-xl font-semibold text-foreground transition-opacity hover:opacity-70"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-foreground/70">
                      {item.description}
                    </p>
                    <p className="text-sm font-medium text-foreground/70">
                      {formatPrice(item.priceInCents)} / {item.unit}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                        disabled={isCheckoutLocked}
                      >
                        -
                      </Button>
                      <div className="min-w-12 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                        disabled={isCheckoutLocked}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(item.quantity * item.priceInCents)}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-0 text-sm text-red-600 hover:bg-transparent hover:text-red-700"
                      onClick={() => removeItem(item.slug)}
                      disabled={isCheckoutLocked}
                    >
                      Remove
                    </Button>
                  </div>
                </article>
              ))}
            </section>

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
                    Checkout is using your current order snapshot. Close the
                    modal to make changes.
                  </p>
                ) : null}

                <Button
                  type="button"
                  variant="brand"
                  className="w-full"
                  onClick={handleCheckoutStart}
                  disabled={isCheckoutLocked}
                >
                  Checkout
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={clear}
                  disabled={isCheckoutLocked}
                >
                  Clear order
                </Button>
              </div>
            </aside>
          </div>
        </div>
      )}

      <OrderCheckoutModal
        isOpen={isCheckoutOpen}
        onOpenChange={handleCheckoutOpenChange}
        modalState={checkoutModalState}
        checkoutItems={checkoutItems}
        subtotal={checkoutItems.reduce(
          (sum, item) => sum + item.priceInCents * item.quantity,
          0
        )}
        totalUnits={checkoutItems.reduce((sum, item) => sum + item.quantity, 0)}
        stripePublishableKey={stripePublishableKey}
        onErrorChange={setErrorMessage}
        onPaymentSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
