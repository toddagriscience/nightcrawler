// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { seedProduct } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { inArray } from 'drizzle-orm';
import { env } from '@/lib/env';
import logger from '@/lib/logger';
import { getStripeClient } from '@/lib/stripe/client';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import type {
  CreateOrderCheckoutSessionInput,
  CreateOrderCheckoutSessionResult,
  OrderCheckoutSessionStatusResult,
} from './types';

/** Smallest charge Stripe accepts for this order flow. */
const minimumOrderAmountInCents = 50;
/** Query string key Stripe uses to return the Checkout Session id. */
const checkoutSessionIdParam = 'session_id';
/** Stripe placeholder token interpolated into the checkout return URL. */
const checkoutSessionIdPlaceholder = ['{', 'CHECKOUT_SESSION_ID', '}'].join('');

/**
 * Creates a Stripe Checkout Session for the authenticated user's current order.
 *
 * @param {CreateOrderCheckoutSessionInput} input - Current client order payload.
 * @returns {Promise<CreateOrderCheckoutSessionResult>} The client secret or a recoverable error.
 */
export async function createOrderCheckoutSession(
  input: CreateOrderCheckoutSessionInput
): Promise<CreateOrderCheckoutSessionResult> {
  const items = input.items.filter((item) => item.quantity > 0);

  if (items.length === 0) {
    return {
      clientSecret: null,
      error: 'Your order is empty. Add products before checking out.',
    };
  }

  try {
    const currentUser = await getAuthenticatedInfo();
    const stripe = getStripeClient();
    const productIds = Array.from(
      new Set(
        items
          .map((item) => item.seedProductId)
          .filter((productId) => Number.isInteger(productId))
      )
    );

    if (productIds.length === 0) {
      return {
        clientSecret: null,
        error:
          'Your order contains invalid products. Refresh the page and try again.',
      };
    }

    const products = await db
      .select({
        id: seedProduct.id,
        slug: seedProduct.slug,
        name: seedProduct.name,
        stock: seedProduct.stock,
        priceInCents: seedProduct.priceInCents,
      })
      .from(seedProduct)
      .where(inArray(seedProduct.id, productIds));

    /** Seed products keyed by database id for fast line-item validation. */
    const productsById = new Map(
      products.map((product) => [product.id, product] as const)
    );

    let amount = 0;

    for (const item of items) {
      const product = productsById.get(item.seedProductId);

      if (!product || product.slug !== item.slug) {
        return {
          clientSecret: null,
          error:
            'One or more products in your order are no longer available. Refresh the page and try again.',
        };
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return {
          clientSecret: null,
          error: `Enter a valid quantity for ${product.name}.`,
        };
      }

      if (product.stock < item.quantity) {
        return {
          clientSecret: null,
          error: `${product.name} no longer has enough stock to fulfill this order.`,
        };
      }

      amount += product.priceInCents * item.quantity;
    }

    if (amount < minimumOrderAmountInCents) {
      return {
        clientSecret: null,
        error: 'Order total must be at least $0.50 to process a payment.',
      };
    }

    const checkoutMetadata = {
      farmId: String(currentUser.farmId),
      userId: String(currentUser.id),
      itemCount: String(items.length),
      itemSummary: items
        .map((item) => `${item.seedProductId}:${item.quantity}`)
        .join(','),
    };

    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      customer_email: currentUser.email,
      return_url: `${env.baseUrl}/order?${checkoutSessionIdParam}=${checkoutSessionIdPlaceholder}`,
      metadata: checkoutMetadata,
      line_items: items.map((item) => {
        const product = productsById.get(item.seedProductId)!;

        return {
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: product.priceInCents,
            product_data: {
              name: product.name,
            },
          },
        };
      }),
      payment_intent_data: {
        receipt_email: currentUser.email,
        metadata: checkoutMetadata,
      },
    });

    if (!checkoutSession.client_secret) {
      logger.error(
        'Stripe Checkout Session was created without a client secret',
        {
          checkoutSessionId: checkoutSession.id,
        }
      );
      return {
        clientSecret: null,
        error:
          'We could not initialize checkout right now. Please try again in a moment.',
      };
    }

    return {
      clientSecret: checkoutSession.client_secret,
      error: null,
    };
  } catch (error) {
    logger.error('Failed to create order checkout session', { error });
    return {
      clientSecret: null,
      error:
        'We could not initialize checkout right now. Please try again in a moment.',
    };
  }
}

/**
 * Loads the current status for a Stripe Checkout Session returned to `/order`.
 *
 * @param {string} sessionId - Stripe Checkout Session id from the return URL.
 * @returns Session completion state or a recoverable error.
 */
export async function getOrderCheckoutSessionStatus(
  sessionId: string
): Promise<OrderCheckoutSessionStatusResult> {
  if (!sessionId.trim()) {
    return {
      status: null,
      customerEmail: null,
      error: 'Missing Stripe checkout session id.',
    };
  }

  try {
    const currentUser = await getAuthenticatedInfo();
    const stripe = getStripeClient();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      checkoutSession.metadata?.userId !== String(currentUser.id) ||
      checkoutSession.metadata?.farmId !== String(currentUser.farmId)
    ) {
      logger.error('Order checkout session metadata did not match user', {
        checkoutSessionId: checkoutSession.id,
        currentUserId: currentUser.id,
        currentFarmId: currentUser.farmId,
        metadata: checkoutSession.metadata,
      });
      return {
        status: null,
        customerEmail: null,
        error: 'This checkout session is no longer available.',
      };
    }

    return {
      status: checkoutSession.status,
      customerEmail:
        checkoutSession.customer_details?.email ??
        checkoutSession.customer_email,
      error: null,
    };
  } catch (error) {
    logger.error('Failed to load order checkout session status', {
      error,
      sessionId,
    });
    return {
      status: null,
      customerEmail: null,
      error:
        'We could not verify checkout status right now. Please try again in a moment.',
    };
  }
}
