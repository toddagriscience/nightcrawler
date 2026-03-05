// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  resolveFarmIdFromStripeData,
  syncFarmSubscriptionFromStripe,
  upsertFarmSubscriptionFromStripe,
} from '@/lib/utils/stripe/subscription-db';
import logger from '@/lib/logger';
import { stripe } from '@/lib/stripe/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
  }

  return secret;
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
  } catch (error) {
    logger.error('Failed to verify Stripe webhook signature', { error });
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') {
          break;
        }

        const stripeCustomerId =
          typeof session.customer === 'string' ? session.customer : null;

        const farmId = await resolveFarmIdFromStripeData({
          metadataFarmId: session.metadata?.farmId,
          stripeCustomerId,
        });

        if (!farmId) {
          logger.warn(
            'Unable to determine farm for checkout.session.completed',
            {
              checkoutSessionId: session.id,
            }
          );
          break;
        }

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;

        if (!subscriptionId) {
          logger.warn(
            'No subscription ID found on completed checkout session',
            {
              checkoutSessionId: session.id,
              farmId,
            }
          );
          break;
        }

        await syncFarmSubscriptionFromStripe({
          farmId,
          subscriptionId,
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        const farmId = await resolveFarmIdFromStripeData({
          metadataFarmId: subscription.metadata?.farmId,
          stripeCustomerId,
        });

        if (!farmId) {
          logger.warn(
            'Unable to determine farm for subscription webhook event',
            {
              eventType: event.type,
              subscriptionId: subscription.id,
            }
          );
          break;
        }

        await upsertFarmSubscriptionFromStripe({
          farmId,
          subscription,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Failed to process Stripe webhook event', {
      eventType: event.type,
      error,
    });
    return NextResponse.json(
      { error: 'Webhook handler failure' },
      { status: 500 }
    );
  }
}
