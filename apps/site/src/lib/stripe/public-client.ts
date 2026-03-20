// Copyright © Todd Agriscience, Inc. All rights reserved.

import { loadStripe } from '@stripe/stripe-js';

/**
 * Loads Stripe.js in the browser using the provided publishable key.
 *
 * @returns {ReturnType<typeof loadStripe>} Stripe.js loader promise.
 */
export function getStripeJsClient() {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
}
