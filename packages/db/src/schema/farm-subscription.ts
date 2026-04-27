// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** Stripe billing/payment state for each farm.
 *
 * Farms start by completing an ACH setup (`status = 'bank_setup_complete'`)
 * during the application. A Stripe subscription may be attached later when
 * the farm transitions to a paid client. Subscription-specific fields remain
 * nullable so that the same row can represent either state.
 *
 * While the farm is in the `bank_setup_complete` state, the columns are
 * reused as follows to avoid a schema migration:
 * - `stripeSubscriptionId` holds the Stripe SetupIntent ID (`seti_...`).
 * - `stripePriceId` holds the Stripe payment method ID (`pm_...`).
 *
 * When a paid subscription is later attached to the farm, those columns are
 * overwritten with the real subscription/price IDs. The payment method
 * remains attached to the Stripe customer, so nothing is lost. */
export const farmSubscription = pgTable('farm_subscription', {
  /** One row per farm. */
  farmId: integer()
    .references(() => farm.id, { onDelete: 'cascade' })
    .primaryKey(),
  /** Stripe subscription ID (sub_...) or SetupIntent ID (seti_...) while the
   * farm is only at the bank-setup stage. */
  stripeSubscriptionId: varchar({ length: 255 }).unique(),
  /** Stripe price ID backing the subscription, or payment method ID
   * (pm_...) while the farm is only at the bank-setup stage. */
  stripePriceId: varchar({ length: 255 }),
  /** Lifecycle status. Includes Stripe subscription statuses (active,
   * trialing, past_due, canceled, etc.) and the local `bank_setup_complete`
   * value used after a successful ACH SetupIntent. */
  status: varchar({ length: 50 }),
  /** Subscription amount in smallest currency unit (e.g. cents). */
  amount: integer(),
  /** ISO currency code. */
  currency: varchar({ length: 10 }),
  /** Billing interval from Stripe price (month/year/week/day). */
  billingInterval: varchar({ length: 20 }),
  /** Billing interval count from Stripe price. */
  billingIntervalCount: integer(),
  /** Whether the subscription is set to cancel at period end. */
  cancelAtPeriodEnd: boolean().default(false),
  /** Subscription current period end timestamp. */
  currentPeriodEnd: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
