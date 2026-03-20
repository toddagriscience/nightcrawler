// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';
import { user } from './user';

/** Purchased quantity for a single seed product within a processed checkout. */
export interface SeedOrderCheckoutItem {
  /** Seed product id purchased during checkout. */
  seedProductId: number;
  /** Purchased quantity for the matching seed product. */
  quantity: number;
}

/**
 * Processed Stripe checkout session for a seed order.
 * This is stored outside Stripe so fulfillment stays idempotent even if Stripe
 * metadata changes, internal email delivery has to be retried, or inventory
 * needs to be reconciled without depending on a remote API read.
 */
export const seedOrderCheckout = pgTable('seed_order_checkout', {
  /** Auto increment id. */
  id: serial().primaryKey().notNull(),
  /** Stripe Checkout Session id used for idempotent fulfillment. */
  stripeCheckoutSessionId: varchar({ length: 255 }).notNull().unique(),
  /** Stripe PaymentIntent id associated with the checkout session. */
  stripePaymentIntentId: varchar({ length: 255 }).unique(),
  /** Farm that placed the order. */
  farmId: integer()
    .references(() => farm.id, { onDelete: 'cascade' })
    .notNull(),
  /** User that initiated the order. */
  userId: integer()
    .references(() => user.id)
    .notNull(),
  /** Customer email returned by Stripe for this checkout. */
  customerEmail: varchar({ length: 320 }),
  /** Ordered items captured from checkout metadata for recovery and emails. */
  items: jsonb().$type<SeedOrderCheckoutItem[]>().notNull(),
  /** Timestamp when stock was successfully decremented. */
  fulfilledAt: timestamp(),
  /** Timestamp when the confirmation email was successfully sent. */
  emailSentAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
