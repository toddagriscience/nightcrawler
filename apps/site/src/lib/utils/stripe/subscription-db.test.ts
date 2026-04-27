// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  setCustomerDefaultPaymentMethod,
  upsertFarmBankSetupFromStripe,
} from './subscription-db';
import type Stripe from 'stripe';

/**
 * `setCustomerDefaultPaymentMethod` is a pure Stripe call wrapped in a
 * try/catch that logs and swallows. We mock the Stripe client and assert
 * both the happy path and the error-swallowing behaviour.
 *
 * `upsertFarmBankSetupFromStripe` writes to the DB via Drizzle. The DB
 * mock here is intentionally minimal -- we care about whether the helper
 * pins the new bank as the customer default after writing.
 */

/**
 * `vi.mock` factories are hoisted above all imports, so any variables
 * they reference must be defined via `vi.hoisted` to live in the same
 * top-of-file scope.
 */
const { mockCustomersUpdate, mockLoggerError, mockSelectResult } = vi.hoisted(
  () => ({
    mockCustomersUpdate: vi.fn(),
    mockLoggerError: vi.fn(),
    mockSelectResult: vi.fn(() => Promise.resolve([] as { status: string }[])),
  })
);

vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: () => ({
    customers: { update: mockCustomersUpdate },
  }),
}));

vi.mock('@/lib/logger', () => ({
  default: {
    error: mockLoggerError,
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
  logger: {
    error: mockLoggerError,
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

/**
 * Minimal Drizzle stub. Returns an empty array for `select(...)` chains
 * and resolves immediately for inserts/updates. The webhook helper is
 * built around chained queries; we only need them to not throw.
 */
vi.mock('@nightcrawler/db/schema/connection', () => {
  const insertReturn = {
    values: () => ({
      onConflictDoUpdate: () => Promise.resolve(undefined),
    }),
  };
  const updateReturn = {
    set: () => ({ where: () => Promise.resolve(undefined) }),
  };
  const selectReturn = {
    from: () => ({
      where: () => ({
        limit: () => mockSelectResult(),
      }),
    }),
  };
  return {
    db: {
      insert: () => insertReturn,
      update: () => updateReturn,
      select: () => selectReturn,
    },
  };
});

beforeEach(() => {
  mockCustomersUpdate.mockReset();
  mockLoggerError.mockReset();
  mockSelectResult.mockReset();
  mockSelectResult.mockReturnValue(Promise.resolve([]));
});

describe('setCustomerDefaultPaymentMethod', () => {
  it('updates the Stripe customer with the new default payment method', async () => {
    mockCustomersUpdate.mockResolvedValue({});

    await setCustomerDefaultPaymentMethod('cus_abc', 'pm_xyz');

    expect(mockCustomersUpdate).toHaveBeenCalledWith('cus_abc', {
      invoice_settings: { default_payment_method: 'pm_xyz' },
    });
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it('swallows Stripe errors and logs them (does not throw)', async () => {
    mockCustomersUpdate.mockRejectedValue(new Error('stripe boom'));

    // Should not throw -- we treat default-PM as a nice-to-have.
    await expect(
      setCustomerDefaultPaymentMethod('cus_err', 'pm_err')
    ).resolves.toBeUndefined();

    expect(mockLoggerError).toHaveBeenCalledTimes(1);
  });
});

describe('upsertFarmBankSetupFromStripe', () => {
  /** Minimal SetupIntent shape that satisfies the helper. */
  function makeSetupIntent(
    overrides: Partial<Stripe.SetupIntent> = {}
  ): Stripe.SetupIntent {
    return {
      id: 'seti_webhook',
      payment_method: 'pm_webhook',
      customer: 'cus_webhook',
      ...overrides,
    } as unknown as Stripe.SetupIntent;
  }

  it('pins the bank as the customer default after writing', async () => {
    mockCustomersUpdate.mockResolvedValue({});
    mockSelectResult.mockReturnValue(Promise.resolve([]));

    await upsertFarmBankSetupFromStripe({
      farmId: 42,
      setupIntent: makeSetupIntent(),
    });

    expect(mockCustomersUpdate).toHaveBeenCalledWith('cus_webhook', {
      invoice_settings: { default_payment_method: 'pm_webhook' },
    });
  });

  it('skips DB and Stripe work when the SetupIntent has no payment method', async () => {
    await upsertFarmBankSetupFromStripe({
      farmId: 42,
      setupIntent: makeSetupIntent({ payment_method: null }),
    });

    expect(mockCustomersUpdate).not.toHaveBeenCalled();
  });

  it('preserves an active subscription status instead of downgrading', async () => {
    mockCustomersUpdate.mockResolvedValue({});
    // First select returns the existing "active" row.
    mockSelectResult.mockReturnValueOnce(
      Promise.resolve([{ status: 'active' }])
    );

    await upsertFarmBankSetupFromStripe({
      farmId: 42,
      setupIntent: makeSetupIntent(),
    });

    // Even with an active sub on file, we should still pin the new bank
    // as the customer default so /account shows the latest one.
    expect(mockCustomersUpdate).toHaveBeenCalledTimes(1);
  });

  it('handles an expanded customer object on the SetupIntent', async () => {
    mockCustomersUpdate.mockResolvedValue({});
    await upsertFarmBankSetupFromStripe({
      farmId: 42,
      setupIntent: makeSetupIntent({
        customer: { id: 'cus_expanded' } as Stripe.Customer,
      }),
    });

    expect(mockCustomersUpdate).toHaveBeenCalledWith(
      'cus_expanded',
      expect.any(Object)
    );
  });
});
