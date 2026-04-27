// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NOT_SET } from './constants';
import { getStripeSubscriptionData } from './subscription';

/**
 * `subscription.ts` is a thin orchestration layer over Stripe + a single
 * read from the `farm` table. We mock both rather than spinning up a
 * full PGlite database; the logic under test is purely about how Stripe
 * responses are reshaped and which fallbacks fire.
 */

/** All mock fns referenced by `vi.mock` factories must be hoisted. */
const {
  mockGetAuthenticatedInfo,
  mockFarmRecord,
  mockSubscriptionsList,
  mockCustomersRetrieve,
  mockPaymentMethodsList,
  mockInvoicesCreatePreview,
} = vi.hoisted(() => ({
  mockGetAuthenticatedInfo: vi.fn(),
  mockFarmRecord: vi.fn(),
  mockSubscriptionsList: vi.fn(),
  mockCustomersRetrieve: vi.fn(),
  mockPaymentMethodsList: vi.fn(),
  mockInvoicesCreatePreview: vi.fn(),
}));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: () => mockGetAuthenticatedInfo(),
}));

vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: () => ({
    subscriptions: { list: mockSubscriptionsList },
    customers: { retrieve: mockCustomersRetrieve },
    paymentMethods: { list: mockPaymentMethodsList },
    invoices: { createPreview: mockInvoicesCreatePreview },
  }),
}));

vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve(mockFarmRecord()),
        }),
      }),
    }),
  },
}));

const usBankPaymentMethod = {
  id: 'pm_bank',
  type: 'us_bank_account',
  us_bank_account: { bank_name: 'Test Bank', last4: '6789' },
};

beforeEach(() => {
  mockGetAuthenticatedInfo.mockReset();
  mockFarmRecord.mockReset();
  mockSubscriptionsList.mockReset();
  mockCustomersRetrieve.mockReset();
  mockPaymentMethodsList.mockReset();
  mockInvoicesCreatePreview.mockReset();

  mockGetAuthenticatedInfo.mockResolvedValue({ farmId: 1 });
});

describe('getStripeSubscriptionData', () => {
  it('returns all defaults when the farm has no Stripe customer yet', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: null }]);

    const result = await getStripeSubscriptionData();
    expect(result).toEqual({
      renewal: NOT_SET,
      billingCycle: NOT_SET,
      nextBillingDate: NOT_SET,
      nextPayment: NOT_SET,
      paymentMethod: NOT_SET,
    });
    expect(mockSubscriptionsList).not.toHaveBeenCalled();
  });

  it('returns the customer default bank when there is no active subscription (free-tier farm)', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: 'cus_free' }]);
    mockSubscriptionsList.mockResolvedValue({ data: [] });
    mockCustomersRetrieve.mockResolvedValue({
      id: 'cus_free',
      deleted: false,
      invoice_settings: { default_payment_method: usBankPaymentMethod },
    });

    const result = await getStripeSubscriptionData();
    expect(result.paymentMethod).toBe('Test Bank ending in 6789');
    // Billing fields stay defaults because there is no subscription.
    expect(result.billingCycle).toBe(NOT_SET);
    expect(result.nextBillingDate).toBe(NOT_SET);
    expect(result.nextPayment).toBe(NOT_SET);
    expect(result.renewal).toBe(NOT_SET);

    expect(mockPaymentMethodsList).not.toHaveBeenCalled();
  });

  it('falls back to listing payment methods when the customer has no default', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: 'cus_no_default' }]);
    mockSubscriptionsList.mockResolvedValue({ data: [] });
    mockCustomersRetrieve.mockResolvedValue({
      id: 'cus_no_default',
      deleted: false,
      invoice_settings: { default_payment_method: null },
    });
    mockPaymentMethodsList.mockResolvedValue({ data: [usBankPaymentMethod] });

    const result = await getStripeSubscriptionData();
    expect(result.paymentMethod).toBe('Test Bank ending in 6789');
    expect(mockPaymentMethodsList).toHaveBeenCalledWith({
      customer: 'cus_no_default',
      type: 'us_bank_account',
      limit: 1,
    });
  });

  it('returns Not set when no subscription, no default, and no listed banks', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: 'cus_empty' }]);
    mockSubscriptionsList.mockResolvedValue({ data: [] });
    mockCustomersRetrieve.mockResolvedValue({
      id: 'cus_empty',
      deleted: false,
      invoice_settings: { default_payment_method: null },
    });
    mockPaymentMethodsList.mockResolvedValue({ data: [] });

    const result = await getStripeSubscriptionData();
    expect(result.paymentMethod).toBe(NOT_SET);
  });

  it('returns full billing info when there is an active subscription', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: 'cus_active' }]);
    mockSubscriptionsList.mockResolvedValue({
      data: [
        {
          id: 'sub_active',
          status: 'active',
          cancel_at_period_end: false,
          default_payment_method: usBankPaymentMethod,
          items: {
            data: [
              {
                price: {
                  recurring: { interval: 'month', interval_count: 1 },
                },
              },
            ],
          },
        },
      ],
    });
    mockInvoicesCreatePreview.mockResolvedValue({
      period_end: 1_900_000_000,
      amount_due: 12_345,
      currency: 'usd',
    });

    const result = await getStripeSubscriptionData();
    expect(result.renewal).toBe('Auto-renews');
    expect(result.billingCycle).toBe('Monthly');
    expect(result.nextBillingDate).not.toBe(NOT_SET);
    expect(result.nextPayment).toBe('$123.45');
    expect(result.paymentMethod).toBe('Test Bank ending in 6789');
  });

  it('falls back to the customer default bank when the subscription has none', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: 'cus_subnopm' }]);
    mockSubscriptionsList.mockResolvedValue({
      data: [
        {
          id: 'sub_no_pm',
          status: 'active',
          cancel_at_period_end: true,
          default_payment_method: null,
          items: {
            data: [
              {
                price: {
                  recurring: { interval: 'year', interval_count: 1 },
                },
              },
            ],
          },
        },
      ],
    });
    mockInvoicesCreatePreview.mockResolvedValue({});
    mockCustomersRetrieve.mockResolvedValue({
      id: 'cus_subnopm',
      deleted: false,
      invoice_settings: { default_payment_method: usBankPaymentMethod },
    });

    const result = await getStripeSubscriptionData();
    expect(result.renewal).toBe('Does not renew');
    expect(result.billingCycle).toBe('Annual');
    expect(result.paymentMethod).toBe('Test Bank ending in 6789');
  });

  it('returns defaults when something throws (e.g. Stripe outage)', async () => {
    mockFarmRecord.mockReturnValue([{ stripeCustomerId: 'cus_err' }]);
    mockSubscriptionsList.mockRejectedValue(new Error('stripe down'));

    const result = await getStripeSubscriptionData();
    expect(result.paymentMethod).toBe(NOT_SET);
    expect(result.billingCycle).toBe(NOT_SET);
  });
});
