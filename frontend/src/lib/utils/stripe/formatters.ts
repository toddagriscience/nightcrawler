// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NOT_SET } from './constants';

export function formatBillingCycle(
  interval: string,
  intervalCount: number
): string {
  const intervalLabels: Record<string, string> = {
    day: 'Daily',
    week: 'Weekly',
    month: 'Monthly',
    year: 'Annual',
  };

  if (intervalCount === 1) {
    return intervalLabels[interval] ?? `Every ${interval}`;
  }

  return `Every ${intervalCount} ${interval}s`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatCurrency(
  amountInCents: number,
  currency: string
): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function formatPaymentMethod(paymentMethod: unknown): string {
  if (!paymentMethod || typeof paymentMethod === 'string') {
    return NOT_SET;
  }

  const pm = paymentMethod as {
    type?: string;
    card?: { brand?: string; last4?: string };
    us_bank_account?: { bank_name?: string; last4?: string };
  };

  if (pm.type === 'card' && pm.card) {
    const brand = pm.card.brand
      ? pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1)
      : 'Card';
    return `${brand} ending in ${pm.card.last4}`;
  }

  if (pm.type === 'us_bank_account' && pm.us_bank_account) {
    const bankName = pm.us_bank_account.bank_name ?? 'Bank';
    return `${bankName} ending in ${pm.us_bank_account.last4}`;
  }

  return pm.type
    ? pm.type.charAt(0).toUpperCase() + pm.type.slice(1).replace(/_/g, ' ')
    : NOT_SET;
}
