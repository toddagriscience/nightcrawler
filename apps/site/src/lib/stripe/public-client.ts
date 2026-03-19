// Copyright © Todd Agriscience, Inc. All rights reserved.

import { loadStripe } from '@stripe/stripe-js';

/** Stripe.js loader promises keyed by publishable key for reuse across renders. */
const stripePromises = new Map<string, ReturnType<typeof loadStripe>>();

/**
 * Loads Stripe.js in the browser using the provided publishable key.
 *
 * @param {string} publishableKey - Browser-safe Stripe publishable key.
 * @returns {ReturnType<typeof loadStripe>} Cached Stripe.js loader promise.
 */
export function getStripeJsClient(publishableKey: string) {
  if (!stripePromises.has(publishableKey)) {
    stripePromises.set(publishableKey, loadStripe(publishableKey));
  }

  return stripePromises.get(publishableKey)!;
}
