// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { farm } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { logger } from '@/lib/logger';
import { getStripeClient } from '@/lib/stripe/client';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';
import { NOT_SET } from './constants';
import {
  formatBillingCycle,
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from './formatters';
import { StripeSubscriptionData } from './types';

/**
 * Fetches subscription/billing data from Stripe for the current user's farm.
 *
 * Returns 'Not set' defaults if the farm has no Stripe customer ID or
 * if no active subscription is found.
 */
export async function getStripeSubscriptionData(): Promise<StripeSubscriptionData> {
  const defaults: StripeSubscriptionData = {
    renewal: NOT_SET,
    billingCycle: NOT_SET,
    nextBillingDate: NOT_SET,
    nextPayment: NOT_SET,
    paymentMethod: NOT_SET,
  };

  try {
    const currentUser = await getAuthenticatedInfo();

    const [farmRecord] = await db
      .select({ stripeCustomerId: farm.stripeCustomerId })
      .from(farm)
      .where(eq(farm.id, currentUser.farmId))
      .limit(1);

    if (!farmRecord?.stripeCustomerId) {
      return defaults;
    }

    const stripe = getStripeClient();

    const subscriptions = await stripe.subscriptions.list({
      customer: farmRecord.stripeCustomerId,
      status: 'active',
      limit: 1,
      expand: ['data.default_payment_method'],
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return defaults;
    }

    // Renewal status
    const renewal = subscription.cancel_at_period_end
      ? 'Does not renew'
      : 'Auto-renews';

    // Billing cycle (based on the first price's recurring interval)
    const interval = subscription.items.data[0]?.price?.recurring?.interval;
    const intervalCount =
      subscription.items.data[0]?.price?.recurring?.interval_count ?? 1;
    const billingCycle = interval
      ? formatBillingCycle(interval, intervalCount)
      : NOT_SET;

    // Next billing date and next payment amount via upcoming invoice
    let nextBillingDate = NOT_SET;
    let nextPayment = NOT_SET;
    try {
      const upcomingInvoice = await stripe.invoices.createPreview({
        customer: farmRecord.stripeCustomerId,
        subscription: subscription.id,
      });
      if (upcomingInvoice.period_end) {
        nextBillingDate = formatDate(upcomingInvoice.period_end);
      }
      if (upcomingInvoice.amount_due != null) {
        nextPayment = formatCurrency(
          upcomingInvoice.amount_due,
          upcomingInvoice.currency
        );
      }
    } catch {
      // If upcoming invoice retrieval fails (e.g. subscription is cancelling),
      // fall back to defaults
    }

    // Payment method
    const paymentMethod = formatPaymentMethod(
      subscription.default_payment_method
    );

    return {
      renewal,
      billingCycle,
      nextBillingDate,
      nextPayment,
      paymentMethod,
    };
  } catch (error) {
    logger.error('Error fetching Stripe subscription data', { error });
    return defaults;
  }
}
