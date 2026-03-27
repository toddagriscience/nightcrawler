// Copyright © Todd Agriscience, Inc. All rights reserved.

import Stripe from 'stripe';

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined;
};

function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover',
    typescript: true,
  });
}

function getStripeSecretKey(): string {
  const secretKey =
    process.env.STRIPE_SECRET_KEY ??
    (process.env.NODE_ENV === 'production' ? undefined : 'sk_test_default');

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Please add it to your environment variables.'
    );
  }

  return secretKey;
}

export function getStripeClient(): Stripe {
  if (process.env.NODE_ENV !== 'production') {
    if (!globalForStripe.stripe) {
      globalForStripe.stripe = createStripeClient(getStripeSecretKey());
    }

    return globalForStripe.stripe;
  }

  return createStripeClient(getStripeSecretKey());
}
