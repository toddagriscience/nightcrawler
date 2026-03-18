// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { farm, farmSubscription } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import logger from '@/lib/logger';
import { getStripeClient } from '@/lib/stripe/client';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

function parseUnixTimestamp(seconds: number | null | undefined): Date | null {
  if (!seconds) {
    return null;
  }

  return new Date(seconds * 1000);
}

/** Upserts a farm's local subscription record from a Stripe subscription object. */
export async function upsertFarmSubscriptionFromStripe({
  farmId,
  subscription,
}: {
  farmId: number;
  subscription: Stripe.Subscription;
}) {
  const firstItem = subscription.items.data[0];
  const price = firstItem?.price;
  const currentPeriodEnd = firstItem?.current_period_end ?? null;

  await db
    .insert(farmSubscription)
    .values({
      farmId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: price?.id ?? null,
      status: subscription.status,
      amount: price?.unit_amount ?? null,
      currency: price?.currency ?? null,
      billingInterval: price?.recurring?.interval ?? null,
      billingIntervalCount: price?.recurring?.interval_count ?? null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: parseUnixTimestamp(currentPeriodEnd),
    })
    .onConflictDoUpdate({
      target: farmSubscription.farmId,
      set: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: price?.id ?? null,
        status: subscription.status,
        amount: price?.unit_amount ?? null,
        currency: price?.currency ?? null,
        billingInterval: price?.recurring?.interval ?? null,
        billingIntervalCount: price?.recurring?.interval_count ?? null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: parseUnixTimestamp(currentPeriodEnd),
        updatedAt: new Date(),
      },
    });

  const stripeCustomerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

  if (stripeCustomerId) {
    await db.update(farm).set({ stripeCustomerId }).where(eq(farm.id, farmId));
  }
}

/** Retrieves a Stripe subscription and syncs it to the database. */
export async function syncFarmSubscriptionFromStripe({
  farmId,
  subscriptionId,
}: {
  farmId: number;
  subscriptionId: string;
}) {
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await upsertFarmSubscriptionFromStripe({ farmId, subscription });
}

/** Resolves farm ID from metadata first, then by Stripe customer ID fallback. */
export async function resolveFarmIdFromStripeData({
  metadataFarmId,
  stripeCustomerId,
}: {
  metadataFarmId?: string | null;
  stripeCustomerId?: string | null;
}): Promise<number | null> {
  const parsedFarmId = metadataFarmId ? Number(metadataFarmId) : NaN;

  if (Number.isInteger(parsedFarmId) && parsedFarmId > 0) {
    return parsedFarmId;
  }

  if (!stripeCustomerId) {
    return null;
  }

  const [existingFarm] = await db
    .select({ id: farm.id })
    .from(farm)
    .where(eq(farm.stripeCustomerId, stripeCustomerId))
    .limit(1);

  if (!existingFarm) {
    logger.warn('Unable to resolve farm for Stripe customer', {
      stripeCustomerId,
    });
    return null;
  }

  return existingFarm.id;
}
