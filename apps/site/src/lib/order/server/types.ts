// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Ordered quantity for a single seed product within a successful checkout. */
export interface SeedOrderFulfillmentItem {
  /** Seed product id from the database. */
  seedProductId: number;
  /** Purchased quantity for that product. */
  quantity: number;
}

/** Input required to fulfill a successful seed-product checkout. */
export interface SeedOrderFulfillmentInput {
  /** Stripe Checkout Session id used for idempotent fulfillment. */
  checkoutSessionId: string;
  /** Stripe PaymentIntent id associated with the checkout session, if any. */
  paymentIntentId: string | null;
  /** Farm metadata copied onto the Stripe checkout session. */
  farmId: number;
  /** User metadata copied onto the Stripe checkout session. */
  userId: number;
  /** Customer email returned by Stripe for confirmation delivery. */
  customerEmail: string | null;
  /** Purchased seed products and quantities. */
  items: SeedOrderFulfillmentItem[];
}

/** Result returned after attempting to fulfill a successful checkout. */
export interface SeedOrderFulfillmentResult {
  /** Whether the checkout had already been fulfilled previously. */
  alreadyFulfilled: boolean;
  /** Whether the internal notification email was sent during this attempt. */
  emailSent: boolean;
}
