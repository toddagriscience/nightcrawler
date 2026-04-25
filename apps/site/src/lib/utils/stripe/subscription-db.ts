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

/**
 * Sets the given bank as the customer's default payment method in Stripe.
 *
 * If Stripe fails for any reason, we just log it and keep going. The bank
 * is already saved on the customer at this point — making it the default
 * is just a nice-to-have so /account can show it and any future bill can
 * use it without us re-asking the user.
 *
 * @param {string} stripeCustomerId - The Stripe customer ID.
 * @param {string} paymentMethodId - The Stripe payment method ID to default.
 */
export async function setCustomerDefaultPaymentMethod(
  stripeCustomerId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    const stripe = getStripeClient();
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  } catch (error) {
    logger.error('Failed to set customer default payment method', {
      stripeCustomerId,
      paymentMethodId,
      error,
    });
  }
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

/** Upserts the farm's bank-setup state from a Stripe SetupIntent.
 *
 * Called from the webhook when `setup_intent.succeeded` fires for a
 * SetupIntent created during the application's Bank Information step.
 * Preserves an already-active subscription status so a paid farm isn't
 * accidentally downgraded to `bank_setup_complete`.
 */
export async function upsertFarmBankSetupFromStripe({
  farmId,
  setupIntent,
}: {
  farmId: number;
  setupIntent: Stripe.SetupIntent;
}) {
  const paymentMethodId =
    typeof setupIntent.payment_method === 'string'
      ? setupIntent.payment_method
      : (setupIntent.payment_method?.id ?? null);

  if (!paymentMethodId) {
    logger.warn('SetupIntent has no payment method; skipping DB sync', {
      setupIntentId: setupIntent.id,
    });
    return;
  }

  const [existing] = await db
    .select({ status: farmSubscription.status })
    .from(farmSubscription)
    .where(eq(farmSubscription.farmId, farmId))
    .limit(1);

  // Don't clobber an active/trialing subscription status on the same row.
  const preserveStatus =
    existing?.status && ['active', 'trialing'].includes(existing.status);
  const nextStatus = preserveStatus ? existing.status! : 'bank_setup_complete';

  // Reuse existing columns: stripeSubscriptionId holds the SetupIntent ID and
  // stripePriceId holds the payment method ID while the farm is in the
  // bank-setup stage. See `farmSubscription` schema for details.
  const writeSetupIds = !preserveStatus;

  await db
    .insert(farmSubscription)
    .values({
      farmId,
      status: nextStatus,
      stripeSubscriptionId: writeSetupIds ? setupIntent.id : null,
      stripePriceId: writeSetupIds ? paymentMethodId : null,
    })
    .onConflictDoUpdate({
      target: farmSubscription.farmId,
      set: {
        status: nextStatus,
        ...(writeSetupIds
          ? {
              stripeSubscriptionId: setupIntent.id,
              stripePriceId: paymentMethodId,
            }
          : {}),
        updatedAt: new Date(),
      },
    });

  const stripeCustomerId =
    typeof setupIntent.customer === 'string'
      ? setupIntent.customer
      : (setupIntent.customer?.id ?? null);

  if (stripeCustomerId) {
    await db.update(farm).set({ stripeCustomerId }).where(eq(farm.id, farmId));
    await setCustomerDefaultPaymentMethod(stripeCustomerId, paymentMethodId);
  }
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
