// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { getStripeJsClient } from '@/lib/stripe/public-client';
import type { CreateOrderCheckoutSessionItemInput } from '../types';
import { createOrderCheckoutSession } from '../actions';
import type { OrderEmbeddedCheckoutProps } from '../types';

/**
 * Embedded Stripe Checkout panel for the authenticated `/order` page.
 *
 * @param {OrderEmbeddedCheckoutProps} props - Checkout session inputs and callbacks.
 * @returns {JSX.Element} Embedded Stripe Checkout panel.
 */
export function OrderEmbeddedCheckout({
  checkoutItems,
  onPaymentSuccess,
  onErrorChange,
}: OrderEmbeddedCheckoutProps) {
  const stripePromise = getStripeJsClient();
  /** Frozen order snapshot for the active Stripe embedded checkout instance. */
  const checkoutItemsRef = useRef(checkoutItems);
  /** Latest error callback without forcing Stripe provider reconfiguration. */
  const onErrorChangeRef = useRef(onErrorChange);
  /** Latest success callback without forcing Stripe provider reconfiguration. */
  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  /** Guards the embedded checkout against duplicate success events. */
  const hasCompletedCheckoutRef = useRef(false);

  useEffect(() => {
    onErrorChangeRef.current = onErrorChange;
    onPaymentSuccessRef.current = onPaymentSuccess;
  }, [onErrorChange, onPaymentSuccess]);

  /**
   * Creates a Stripe Checkout Session for the frozen order snapshot.
   *
   * @returns {Promise<string>} Embedded checkout client secret.
   */
  const fetchClientSecret = useCallback(async () => {
    onErrorChangeRef.current(null);

    const result = await createOrderCheckoutSession({
      items: checkoutItemsRef.current.map<CreateOrderCheckoutSessionItemInput>(
        (item) => ({
          seedProductId: item.seedProductId,
          slug: item.slug,
          name: item.name,
          quantity: item.quantity,
        })
      ),
    });

    if (!result.clientSecret) {
      const errorMessage =
        result.error ??
        'We could not initialize checkout right now. Please try again in a moment.';
      onErrorChangeRef.current(errorMessage);
      throw new Error(errorMessage);
    }

    return result.clientSecret;
  }, []);

  /**
   * Handles Stripe's embedded checkout completion callback once per session.
   *
   * @returns {void}
   */
  const handleComplete = useCallback(() => {
    if (hasCompletedCheckoutRef.current) {
      return;
    }

    hasCompletedCheckoutRef.current = true;
    onErrorChangeRef.current(null);
    onPaymentSuccessRef.current();
  }, []);

  /** Stable provider options for the current checkout session. */
  const checkoutOptions = useMemo(
    () => ({
      fetchClientSecret,
      onComplete: handleComplete,
    }),
    [fetchClientSecret, handleComplete]
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={checkoutOptions}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
