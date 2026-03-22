// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** Stripe subscription state for each farm. */
export const farmSubscription = pgTable('farm_subscription', {
  /** One subscription record per farm. */
  farmId: integer()
    .references(() => farm.id, { onDelete: 'cascade' })
    .primaryKey(),
  /** Stripe subscription ID (sub_...). */
  stripeSubscriptionId: varchar({ length: 255 }).unique(),
  /** Stripe price ID backing the subscription. */
  stripePriceId: varchar({ length: 255 }),
  /** Stripe subscription status (active, trialing, past_due, canceled, etc). */
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
