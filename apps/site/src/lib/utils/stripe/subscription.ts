// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farm } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { logger } from '@/lib/logger';
import { getStripeClient } from '@/lib/stripe/client';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { NOT_SET } from './constants';
import {
  formatBillingCycle,
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from './formatters';
import { StripeSubscriptionData } from './types';

/**
 * Figures out which bank to show on the /account page for a Stripe customer.
 *
 * First we look at the customer's default payment method (the one we pin
 * after a successful bank setup during the apply flow). If that's missing,
 * we fall back to the most recent bank account they ever attached, so
 * people who set up their bank through any other path still see something
 * meaningful on /account.
 */
async function resolveCustomerPaymentMethod(
  stripe: Stripe,
  stripeCustomerId: string
): Promise<Stripe.PaymentMethod | null> {
  try {
    const customer = await stripe.customers.retrieve(stripeCustomerId, {
      expand: ['invoice_settings.default_payment_method'],
    });

    if (!customer.deleted) {
      const defaultPm = customer.invoice_settings?.default_payment_method;
      if (defaultPm && typeof defaultPm !== 'string') {
        return defaultPm;
      }
    }
  } catch (error) {
    logger.error('Failed to retrieve Stripe customer for payment method', {
      stripeCustomerId,
      error,
    });
  }

  try {
    const bankAccounts = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'us_bank_account',
      limit: 1,
    });
    return bankAccounts.data[0] ?? null;
  } catch (error) {
    logger.error('Failed to list Stripe payment methods', {
      stripeCustomerId,
      error,
    });
    return null;
  }
}

/**
 * Gets the farm's billing info from Stripe for the /account page.
 *
 * If the farm has an active subscription, we return its billing terms
 * (cycle, next bill, etc.). For the bank we display, we try the
 * subscription's own bank first, then fall back to the customer's default
 * bank, and finally to the most recent bank they ever attached.
 *
 * If the farm has no active subscription yet, the billing-cycle fields
 * stay as "Not set", but we still try to look up a bank on the customer
 * so farms that finished bank setup during apply still see their bank
 * on file.
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
      const customerPaymentMethod = await resolveCustomerPaymentMethod(
        stripe,
        farmRecord.stripeCustomerId
      );
      return {
        ...defaults,
        paymentMethod: formatPaymentMethod(customerPaymentMethod),
      };
    }

    const renewal = subscription.cancel_at_period_end
      ? 'Does not renew'
      : 'Auto-renews';

    const interval = subscription.items.data[0]?.price?.recurring?.interval;
    const intervalCount =
      subscription.items.data[0]?.price?.recurring?.interval_count ?? 1;
    const billingCycle = interval
      ? formatBillingCycle(interval, intervalCount)
      : NOT_SET;

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

    /**
     * Try the subscription's own bank first; if there isn't one, fall
     * back to the customer's default bank, and finally to any bank
     * account listed on the customer.
     */
    const subscriptionPaymentMethod =
      subscription.default_payment_method &&
      typeof subscription.default_payment_method !== 'string'
        ? subscription.default_payment_method
        : null;
    const paymentMethodSource =
      subscriptionPaymentMethod ??
      (await resolveCustomerPaymentMethod(stripe, farmRecord.stripeCustomerId));

    const paymentMethod = formatPaymentMethod(paymentMethodSource);

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
