// Copyright © Todd Agriscience, Inc. All rights reserved.

import nodemailer from 'nodemailer';
import logger from '@/lib/logger';
import type { SeedOrderCheckoutItem } from '@nightcrawler/db/schema/seed-order-checkout';

/** SMTP port used for seed-order confirmation emails. */
const orderEmailPort = Number.parseInt(
  process.env.ORDER_EMAIL_PORT ?? '587',
  10
);
/** Whether the configured SMTP transport should use TLS immediately. */
const orderEmailSecure = process.env.ORDER_EMAIL_SECURE === 'true';

/** Internal email recipients notified after a successful seed order. */
const internalOrderEmailRecipients = (process.env.INTERNAL_ORDER_EMAIL_TO ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

/**
 * Builds the configured seed-order mail transporter.
 *
 * @returns {ReturnType<typeof nodemailer.createTransport> | null} Mail transporter when configured, otherwise null.
 */
function getOrderEmailTransporter() {
  if (
    !process.env.ORDER_EMAIL_HOST ||
    !process.env.ORDER_EMAIL_FROM ||
    internalOrderEmailRecipients.length === 0 ||
    !Number.isInteger(orderEmailPort)
  ) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.ORDER_EMAIL_HOST,
    port: orderEmailPort,
    secure: orderEmailSecure,
    auth:
      process.env.ORDER_EMAIL_USER && process.env.ORDER_EMAIL_PASSWORD
        ? {
            user: process.env.ORDER_EMAIL_USER,
            pass: process.env.ORDER_EMAIL_PASSWORD,
          }
        : undefined,
  });
}

/**
 * Sends an internal seed-order notification email when SMTP settings are configured.
 *
 * @param {object} input - Notification email content and order details.
 * @param {string | null} input.customerEmail - Customer email from Stripe, if available.
 * @param {string | null} input.customerName - Customer display name, if known.
 * @param {SeedOrderCheckoutItem[]} input.items - Purchased line items for the order.
 * @param {Map<number, { name: string; unit: string }>} input.productsById - Purchased products keyed by id.
 * @param {string} input.checkoutSessionId - Stripe Checkout Session id for support/debugging.
 * @returns {Promise<boolean>} True when an email was sent successfully.
 */
export async function sendInternalSeedOrderNotificationEmail({
  customerEmail,
  customerName,
  items,
  productsById,
  checkoutSessionId,
}: {
  customerEmail: string | null;
  customerName: string | null;
  items: SeedOrderCheckoutItem[];
  productsById: Map<number, { name: string; unit: string }>;
  checkoutSessionId: string;
}): Promise<boolean> {
  const transporter = getOrderEmailTransporter();

  if (!transporter) {
    logger.warn(
      'Skipping internal seed-order notification email because SMTP is not configured',
      {
        checkoutSessionId,
        customerEmail,
      }
    );
    return false;
  }

  /** Human-readable list of ordered items for the email body. */
  const orderLines = items
    .map((item) => {
      const product = productsById.get(item.seedProductId);

      if (!product) {
        return `${item.quantity} x Product #${item.seedProductId}`;
      }

      return `${item.quantity} ${product.unit} of ${product.name}`;
    })
    .join('\n');

  await transporter.sendMail({
    from: process.env.ORDER_EMAIL_FROM,
    to: internalOrderEmailRecipients,
    subject: 'New Todd Agriscience seed order received',
    text: [
      'A new seed order payment completed successfully.',
      '',
      `Customer name: ${customerName ?? 'Unknown'}`,
      `Customer email: ${customerEmail ?? 'Unknown'}`,
      '',
      'Order summary:',
      orderLines,
      '',
      `Checkout session: ${checkoutSessionId}`,
    ].join('\n'),
  });

  return true;
}
