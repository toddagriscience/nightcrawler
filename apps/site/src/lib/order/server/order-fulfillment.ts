// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '@nightcrawler/db/schema/connection';
import { seedOrderCheckout, seedProduct, user } from '@nightcrawler/db/schema';
import type { SeedOrderCheckoutItem } from '@nightcrawler/db/schema/seed-order-checkout';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import logger from '@/lib/logger';
import { sendSeedOrderConfirmationEmail } from './order-email';
import type {
  SeedOrderFulfillmentInput,
  SeedOrderFulfillmentItem,
  SeedOrderFulfillmentResult,
} from './types';

/** Delimiter used to serialize product id and quantity pairs into Stripe metadata. */
const metadataItemSeparator = ',';
/** Delimiter used inside a serialized metadata pair. */
const metadataValueSeparator = ':';

/**
 * Parses serialized order items from Stripe metadata.
 *
 * @param {string | undefined} itemSummary - Comma-delimited `productId:quantity` pairs.
 * @returns {SeedOrderFulfillmentItem[]} Parsed order items.
 */
export function parseSeedOrderItemSummary(
  itemSummary: string | undefined
): SeedOrderFulfillmentItem[] {
  if (!itemSummary?.trim()) {
    return [];
  }

  return itemSummary
    .split(metadataItemSeparator)
    .map((pair) => {
      const [seedProductIdValue, quantityValue] = pair.split(
        metadataValueSeparator
      );
      const seedProductId = Number.parseInt(seedProductIdValue ?? '', 10);
      const quantity = Number.parseInt(quantityValue ?? '', 10);

      return { seedProductId, quantity };
    })
    .filter(
      (item) =>
        Number.isInteger(item.seedProductId) &&
        item.seedProductId > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
}

/**
 * Aggregates duplicate line items by seed product id.
 *
 * @param {SeedOrderFulfillmentItem[]} items - Purchased seed products and quantities.
 * @returns {SeedOrderCheckoutItem[]} Aggregated items for storage and fulfillment.
 */
function normalizeSeedOrderItems(
  items: SeedOrderFulfillmentItem[]
): SeedOrderCheckoutItem[] {
  /** Purchased quantities keyed by seed product id. */
  const quantitiesByProductId = new Map<number, number>();

  for (const item of items) {
    quantitiesByProductId.set(
      item.seedProductId,
      (quantitiesByProductId.get(item.seedProductId) ?? 0) + item.quantity
    );
  }

  return Array.from(quantitiesByProductId.entries()).map(
    ([seedProductId, quantity]) => ({
      seedProductId,
      quantity,
    })
  );
}

/**
 * Sends a seed-order confirmation email for a processed checkout when needed.
 *
 * @param {number} orderId - Stored seed-order checkout id.
 * @returns {Promise<boolean>} True when the confirmation email was sent.
 */
async function sendSeedOrderConfirmationEmailForOrder(
  orderId: number
): Promise<boolean> {
  const [orderRecord] = await db
    .select({
      id: seedOrderCheckout.id,
      checkoutSessionId: seedOrderCheckout.stripeCheckoutSessionId,
      customerEmail: seedOrderCheckout.customerEmail,
      items: seedOrderCheckout.items,
      emailSentAt: seedOrderCheckout.emailSentAt,
      firstName: user.firstName,
    })
    .from(seedOrderCheckout)
    .leftJoin(user, eq(user.id, seedOrderCheckout.userId))
    .where(eq(seedOrderCheckout.id, orderId))
    .limit(1);

  if (!orderRecord || orderRecord.emailSentAt) {
    return false;
  }

  const productIds = orderRecord.items.map((item) => item.seedProductId);
  const products =
    productIds.length > 0
      ? await db
          .select({
            id: seedProduct.id,
            name: seedProduct.name,
            unit: seedProduct.unit,
          })
          .from(seedProduct)
          .where(inArray(seedProduct.id, productIds))
      : [];

  /** Purchased products keyed by database id for email rendering. */
  const productsById = new Map(
    products.map((product) => [
      product.id,
      { name: product.name, unit: product.unit },
    ])
  );

  const emailSent = await sendSeedOrderConfirmationEmail({
    customerEmail: orderRecord.customerEmail,
    customerName: orderRecord.firstName ?? null,
    items: orderRecord.items,
    productsById,
    checkoutSessionId: orderRecord.checkoutSessionId,
  });

  if (!emailSent) {
    return false;
  }

  await db
    .update(seedOrderCheckout)
    .set({ emailSentAt: new Date() })
    .where(eq(seedOrderCheckout.id, orderId));

  return true;
}

/**
 * Decrements seed stock and stores an idempotent fulfillment record for a successful checkout.
 *
 * @param {SeedOrderFulfillmentInput} input - Stripe checkout data required for fulfillment.
 * @returns {Promise<SeedOrderFulfillmentResult>} Fulfillment status for stock and email handling.
 */
export async function fulfillSeedOrderCheckout(
  input: SeedOrderFulfillmentInput
): Promise<SeedOrderFulfillmentResult> {
  const items = normalizeSeedOrderItems(input.items);

  if (!input.checkoutSessionId.trim()) {
    throw new Error('Seed order fulfillment requires a checkout session id.');
  }

  if (items.length === 0) {
    throw new Error(
      'Seed order fulfillment requires at least one purchased item.'
    );
  }

  const [existingOrder] = await db
    .select({
      id: seedOrderCheckout.id,
      emailSentAt: seedOrderCheckout.emailSentAt,
    })
    .from(seedOrderCheckout)
    .where(
      eq(seedOrderCheckout.stripeCheckoutSessionId, input.checkoutSessionId)
    )
    .limit(1);

  if (existingOrder) {
    const emailSent = existingOrder.emailSentAt
      ? false
      : await sendSeedOrderConfirmationEmailForOrder(existingOrder.id);

    return {
      alreadyFulfilled: true,
      emailSent,
    };
  }

  let createdOrderId: number | null = null;

  await db.transaction(async (tx) => {
    const insertedOrders = await tx
      .insert(seedOrderCheckout)
      .values({
        stripeCheckoutSessionId: input.checkoutSessionId,
        stripePaymentIntentId: input.paymentIntentId,
        farmId: input.farmId,
        userId: input.userId,
        customerEmail: input.customerEmail,
        items,
      })
      .onConflictDoNothing({
        target: seedOrderCheckout.stripeCheckoutSessionId,
      })
      .returning({ id: seedOrderCheckout.id });

    const insertedOrder = insertedOrders[0];

    if (!insertedOrder) {
      return;
    }

    createdOrderId = insertedOrder.id;
    const productIds = items.map((item) => item.seedProductId);
    const products = await tx
      .select({
        id: seedProduct.id,
        name: seedProduct.name,
      })
      .from(seedProduct)
      .where(inArray(seedProduct.id, productIds));

    /** Seed products keyed by database id for validation during fulfillment. */
    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    for (const item of items) {
      const product = productsById.get(item.seedProductId);

      if (!product) {
        throw new Error(
          `Seed product ${item.seedProductId} no longer exists for checkout ${input.checkoutSessionId}.`
        );
      }

      const updatedProducts = await tx
        .update(seedProduct)
        .set({
          stock: sql`${seedProduct.stock} - ${item.quantity}`,
        })
        .where(
          and(
            eq(seedProduct.id, item.seedProductId),
            gte(seedProduct.stock, item.quantity)
          )
        )
        .returning({ id: seedProduct.id });

      if (updatedProducts.length === 0) {
        throw new Error(
          `${product.name} no longer has enough stock to fulfill checkout ${input.checkoutSessionId}.`
        );
      }
    }

    await tx
      .update(seedOrderCheckout)
      .set({ fulfilledAt: new Date() })
      .where(eq(seedOrderCheckout.id, insertedOrder.id));
  });

  if (!createdOrderId) {
    const [createdByConcurrentRequest] = await db
      .select({
        id: seedOrderCheckout.id,
      })
      .from(seedOrderCheckout)
      .where(
        eq(seedOrderCheckout.stripeCheckoutSessionId, input.checkoutSessionId)
      )
      .limit(1);

    if (!createdByConcurrentRequest) {
      throw new Error(
        `Failed to persist seed order checkout ${input.checkoutSessionId}.`
      );
    }

    const emailSent = await sendSeedOrderConfirmationEmailForOrder(
      createdByConcurrentRequest.id
    );

    return {
      alreadyFulfilled: true,
      emailSent,
    };
  }

  const emailSent =
    await sendSeedOrderConfirmationEmailForOrder(createdOrderId);

  logger.info('Fulfilled seed order checkout session', {
    checkoutSessionId: input.checkoutSessionId,
    paymentIntentId: input.paymentIntentId,
    itemCount: items.length,
    emailSent,
  });

  return {
    alreadyFulfilled: false,
    emailSent,
  };
}
