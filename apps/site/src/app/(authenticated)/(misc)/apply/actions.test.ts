// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';
import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAchSetupIntent,
  inviteUserToFarm,
  recordAchSetupComplete,
  saveApplication,
  saveGeneralBusinessInformation,
  submitApplication,
} from './actions';

/**
 * Stripe SDK mocks. Only the methods the apply-flow server actions
 * actually call are mocked. Anything else returns `undefined` from
 * `vi.fn()` if accidentally called, which makes the test fail loudly.
 *
 * `vi.mock` factories are hoisted above all imports, so the fns the
 * factories reference must be created via `vi.hoisted` to live in the
 * same hoisted scope.
 */
const {
  mockSetupIntentsCreate,
  mockSetupIntentsRetrieve,
  mockCustomersCreate,
  mockCustomersRetrieve,
  mockSetCustomerDefaultPaymentMethod,
} = vi.hoisted(() => ({
  mockSetupIntentsCreate: vi.fn(),
  mockSetupIntentsRetrieve: vi.fn(),
  mockCustomersCreate: vi.fn(),
  mockCustomersRetrieve: vi.fn(),
  mockSetCustomerDefaultPaymentMethod: vi.fn(),
}));

vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: () => ({
    setupIntents: {
      create: mockSetupIntentsCreate,
      retrieve: mockSetupIntentsRetrieve,
    },
    customers: {
      create: mockCustomersCreate,
      retrieve: mockCustomersRetrieve,
    },
  }),
}));

vi.mock('@/lib/utils/stripe/subscription-db', () => ({
  setCustomerDefaultPaymentMethod: mockSetCustomerDefaultPaymentMethod,
}));

const mockGetClaims = vi.fn();

vi.mock('@/lib/supabase/server', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/supabase/server')>();
  return {
    ...actual,
    createClient: vi.fn(() => ({
      auth: {
        getClaims: mockGetClaims,
      },
    })),
  };
});

vi.mock('@/lib/actions/googleSheets', () => ({
  submitToGoogleSheets: mockSubmitToGoogleSheets,
}));

const mockInviteUser = vi.fn();
vi.mock('@/lib/auth-server', async () => {
  return {
    getUserEmail: async () => {
      const result = mockGetClaims();
      if (result.error || !result.data?.claims) {
        return null;
      }
      return result.data.claims.email || null;
    },
    inviteUser: (...args: unknown[]) => mockInviteUser(...args),
  };
});

const {
  db,
  mockSubmitToGoogleSheets,
  testUserEmail,
  userTable,
  farmTable,
  farmSubscriptionTable,
  seededFarmId,
} = await vi.hoisted(async () => {
  // Polyfill for PGlite
  Blob.prototype.arrayBuffer = function () {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(this);
    });
  };

  const { PGlite } = await import('@electric-sql/pglite');
  const { vector } = await import('@electric-sql/pglite/vector');

  const pglite = new PGlite({
    extensions: { vector },
  });

  await pglite.waitReady;

  await pglite.exec('CREATE EXTENSION IF NOT EXISTS vector;');

  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const { seed } = await import('drizzle-seed');
  const schema = await import('@nightcrawler/db/schema');
  const {
    user,
    farm,
    farmLocation,
    farmCertificate,
    farmInfoInternalApplication,
    farmSubscription,
  } = await import('@nightcrawler/db/schema');

  const db = drizzle(pglite, { schema, casing: 'snake_case' });
  await migrate(db, { migrationsFolder: '../../packages/db/drizzle' });
  await seed(db, { farm });

  const newFarm = await db.select({ farmId: farm.id }).from(farm);
  const { farmId } = newFarm[0];
  await db.insert(user).values({
    firstName: 'Bob',
    lastName: 'Racha',
    email: 'testtest@example.com',
    role: 'Admin',
    farmId,
  });

  await db.insert(farmLocation).values({ farmId });
  await db.insert(farmCertificate).values({ farmId });
  await db.insert(farmInfoInternalApplication).values({ farmId });
  await db.insert(farmSubscription).values({
    farmId,
    status: 'active',
    amount: 200000,
    currency: 'usd',
    billingInterval: 'month',
    billingIntervalCount: 1,
  });

  const testUserEmail = 'testtest@example.com';
  const mockSubmitToGoogleSheets = vi.fn();

  return {
    db,
    mockSubmitToGoogleSheets,
    testUserEmail,
    userTable: user,
    farmTable: farm,
    farmSubscriptionTable: farmSubscription,
    seededFarmId: farmId,
  };
});

vi.mock('@nightcrawler/db/schema/connection', async (importOriginal) => {
  return {
    ...(await importOriginal<
      typeof import('@nightcrawler/db/schema/connection')
    >()),
    db,
  };
});

vi.mock('next/headers', () => {
  return {
    headers: () =>
      new Map<string, string>([
        ['x-forwarded-for', '127.0.0.1'],
        ['user-agent', 'vitest'],
        ['host', 'localhost:3000'],
      ]),
  };
});

beforeEach(async () => {
  await db
    .update(userTable)
    .set({ role: 'Admin' })
    .where(eq(userTable.email, testUserEmail));
});

describe('saveApplication', () => {
  it('saves with no information given', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    const result = await saveApplication({ farmId: 1 });
    expect(result).toEqual({});
  });

  it('saves with some information given', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    const data: FarmInfoInternalApplicationInsert = {
      farmId: 1,
      splitOperation: { foo: 'bar' },
      livestockIncorporation: 'zoo',
    };

    const result = await saveApplication(data);
    expect(result).toEqual({});
  });

  it('throws error with incorrect email', async () => {
    mockGetClaims.mockReturnValue({
      data: { email: '' },
      error: null,
    });

    await expect(saveApplication({ farmId: 1 })).rejects.toThrow();
  });

  it('throws an authorization error for viewers', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    await db
      .update(userTable)
      .set({ role: 'Viewer' })
      .where(eq(userTable.email, testUserEmail));

    await expect(saveApplication({ farmId: 1 })).rejects.toThrow(
      'You do not have permission to edit farm information'
    );
  });
});

describe('saveGeneralBusinessInformation', () => {
  it('throws an authorization error for viewers', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    await db
      .update(userTable)
      .set({ role: 'Viewer' })
      .where(eq(userTable.email, testUserEmail));

    await expect(
      saveGeneralBusinessInformation({
        farmId: 1,
        businessName: 'Viewer Farm',
        hasAddress: 'yes',
      })
    ).rejects.toThrow('You do not have permission to edit farm information');
  });
});

describe('sendApplicationToGoogleSheets', () => {
  beforeEach(() => {
    mockSubmitToGoogleSheets.mockReset();
  });

  it('sends application', async () => {
    process.env.INTERNAL_APPLICATION_GOOGLE_SCRIPT_URL = 'https://google.com';

    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    const result = await submitApplication();
    expect(result).toEqual({});
  });
});

describe('inviteUserToFarm', () => {
  afterEach(async () => {
    mockInviteUser.mockReset();
    await db
      .update(userTable)
      .set({ role: 'Admin' })
      .where(eq(userTable.email, testUserEmail));
  });

  /** Creates valid UserInsert data that matches the user schema from Drizzle */
  const createValidUserData = (
    overrides: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: 'Admin' | 'Viewer';
      job: string;
    }> = {}
  ) => ({
    firstName: overrides.firstName ?? 'Jane',
    lastName: overrides.lastName ?? 'Smith',
    // Use unique email to avoid conflicts with seeded data
    email:
      overrides.email ??
      `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
    phone: overrides.phone ?? '+15551234567',
    role: overrides.role ?? ('Viewer' as const),
    job: overrides.job ?? 'Farm Manager',
  });

  it('successfully invites a user with valid data', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    mockInviteUser.mockResolvedValue({ user: { id: 'new-user-id' } });

    const newUserEmail = `invite-test-${Date.now()}@example.com`;
    const userData = createValidUserData({ email: newUserEmail });
    const result = await inviteUserToFarm(userData);

    expect(mockInviteUser).toHaveBeenCalledWith(newUserEmail, 'Jane');
  });

  it('throws when user is not authenticated', async () => {
    mockGetClaims.mockReturnValue({
      data: null,
      error: new Error('Not authenticated'),
    });

    const userData = createValidUserData();
    await expect(inviteUserToFarm(userData)).rejects.toThrow(
      "No email registered with this user's account"
    );
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it('throws when data is invalid (missing required fields)', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    // Missing required fields - only firstName provided
    const invalidData = {
      firstName: 'John',
    } as Parameters<typeof inviteUserToFarm>[0];

    await expect(inviteUserToFarm(invalidData)).rejects.toThrow();
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it('throws when inviteUser fails', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    const userData = createValidUserData();
    await expect(inviteUserToFarm(userData)).rejects.toThrow(
      'Multiple viewers are not allowed. Please contact support for more information.'
    );
  });

  it('throws when current user is not found', async () => {
    // Use an email that doesn't exist in the database
    mockGetClaims.mockReturnValue({
      data: { claims: { email: 'nonexistent@example.com' } },
      error: null,
    });

    const userData = createValidUserData();
    await expect(inviteUserToFarm(userData)).rejects.toThrow('User not found');
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it('throws when inviting user with Admin role', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    mockInviteUser.mockResolvedValue({ user: { id: 'admin-user-id' } });

    const uniqueEmail = `admin-${Date.now()}@example.com`;
    const userData = createValidUserData({
      email: uniqueEmail,
      role: 'Admin',
      firstName: 'Admin',
      lastName: 'User',
    });
    await expect(inviteUserToFarm(userData)).rejects.toThrow();
  });

  it('throws an authorization error for viewers', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    await db
      .update(userTable)
      .set({ role: 'Viewer' })
      .where(eq(userTable.email, testUserEmail));

    await expect(inviteUserToFarm(createValidUserData())).rejects.toThrow(
      'You do not have permission to edit farm information'
    );
    expect(mockInviteUser).not.toHaveBeenCalled();
  });
});

describe('createAchSetupIntent', () => {
  beforeEach(async () => {
    mockSetupIntentsCreate.mockReset();
    mockSetupIntentsRetrieve.mockReset();
    mockCustomersCreate.mockReset();
    mockCustomersRetrieve.mockReset();
    mockSetCustomerDefaultPaymentMethod.mockReset();

    // Reset the seeded farm so each test starts without a Stripe customer.
    // ensureStripeCustomerForFarm goes through the create path otherwise.
    await db
      .update(farmTable)
      .set({ stripeCustomerId: null })
      .where(eq(farmTable.id, seededFarmId));
  });

  it('creates a SetupIntent with instant verification (no manual entry)', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockCustomersCreate.mockResolvedValue({ id: 'cus_new_test' });
    mockSetupIntentsCreate.mockResolvedValue({
      id: 'seti_test_123',
      client_secret: 'seti_test_123_secret_abc',
    });

    const result = await createAchSetupIntent();

    expect(mockSetupIntentsCreate).toHaveBeenCalledTimes(1);
    const setupIntentArgs = mockSetupIntentsCreate.mock.calls[0][0];
    expect(setupIntentArgs.payment_method_types).toEqual(['us_bank_account']);
    expect(setupIntentArgs.usage).toBe('off_session');
    // Vincent / coworker requirement: instant only, no microdeposits.
    expect(
      setupIntentArgs.payment_method_options.us_bank_account.verification_method
    ).toBe('instant');
    expect(
      setupIntentArgs.payment_method_options.us_bank_account
        .financial_connections.permissions
    ).toContain('payment_method');
    expect(setupIntentArgs.metadata.purpose).toBe('application_ach_setup');
    expect(setupIntentArgs.customer).toBe('cus_new_test');

    expect(result).toEqual({
      data: {
        clientSecret: 'seti_test_123_secret_abc',
        setupIntentId: 'seti_test_123',
      },
    });
  });

  it('reuses an existing Stripe customer when one is already on file', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    // Pretend the farm already has a Stripe customer.
    await db
      .update(farmTable)
      .set({ stripeCustomerId: 'cus_existing_test' })
      .where(eq(farmTable.id, seededFarmId));

    mockCustomersRetrieve.mockResolvedValue({
      id: 'cus_existing_test',
      deleted: false,
    });
    mockSetupIntentsCreate.mockResolvedValue({
      id: 'seti_reuse',
      client_secret: 'seti_reuse_secret',
    });

    await createAchSetupIntent();

    expect(mockCustomersRetrieve).toHaveBeenCalledWith('cus_existing_test');
    expect(mockCustomersCreate).not.toHaveBeenCalled();
    expect(mockSetupIntentsCreate.mock.calls[0][0].customer).toBe(
      'cus_existing_test'
    );
  });

  it('throws when Stripe returns a SetupIntent without a client_secret', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockCustomersCreate.mockResolvedValue({ id: 'cus_new_test' });
    mockSetupIntentsCreate.mockResolvedValue({
      id: 'seti_no_secret',
      client_secret: null,
    });

    await expect(createAchSetupIntent()).rejects.toThrow(
      'Unable to start bank information setup.'
    );
  });

  it('throws an authorization error for viewers', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    await db
      .update(userTable)
      .set({ role: 'Viewer' })
      .where(eq(userTable.email, testUserEmail));

    await expect(createAchSetupIntent()).rejects.toThrow(
      'You do not have permission to edit farm information'
    );
    expect(mockSetupIntentsCreate).not.toHaveBeenCalled();
  });
});

describe('recordAchSetupComplete', () => {
  beforeEach(async () => {
    mockSetupIntentsRetrieve.mockReset();
    mockSetCustomerDefaultPaymentMethod.mockReset();

    // Reset the row to a known "active" state from the original seed so we
    // can detect updates explicitly.
    await db
      .delete(farmSubscriptionTable)
      .where(eq(farmSubscriptionTable.farmId, seededFarmId));
    await db.insert(farmSubscriptionTable).values({
      farmId: seededFarmId,
      status: 'active',
      amount: 200000,
      currency: 'usd',
      billingInterval: 'month',
      billingIntervalCount: 1,
    });
  });

  it('rejects an empty SetupIntent ID without hitting Stripe', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    await expect(recordAchSetupComplete('')).rejects.toThrow(
      'A SetupIntent ID is required.'
    );
    expect(mockSetupIntentsRetrieve).not.toHaveBeenCalled();
  });

  it('rejects when the SetupIntent metadata farmId does not match the user', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockSetupIntentsRetrieve.mockResolvedValue({
      id: 'seti_wrong_farm',
      status: 'succeeded',
      payment_method: 'pm_abc',
      metadata: { farmId: '99999' },
      customer: 'cus_test',
    });

    await expect(recordAchSetupComplete('seti_wrong_farm')).rejects.toThrow(
      'SetupIntent does not belong to this farm.'
    );
    expect(mockSetCustomerDefaultPaymentMethod).not.toHaveBeenCalled();
  });

  it.each([
    'processing',
    'requires_action',
    'requires_confirmation',
    'canceled',
  ])('rejects SetupIntent with status %s', async (status) => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockSetupIntentsRetrieve.mockResolvedValue({
      id: `seti_${status}`,
      status,
      payment_method: 'pm_abc',
      metadata: { farmId: String(seededFarmId) },
      customer: 'cus_test',
    });

    await expect(recordAchSetupComplete(`seti_${status}`)).rejects.toThrow(
      /Bank information setup is not complete/
    );
    expect(mockSetCustomerDefaultPaymentMethod).not.toHaveBeenCalled();
  });

  it('rejects a succeeded SetupIntent that has no payment method', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockSetupIntentsRetrieve.mockResolvedValue({
      id: 'seti_no_pm',
      status: 'succeeded',
      payment_method: null,
      metadata: { farmId: String(seededFarmId) },
      customer: 'cus_test',
    });

    await expect(recordAchSetupComplete('seti_no_pm')).rejects.toThrow(
      /Bank information setup is not complete/
    );
  });

  it('writes bank_setup_complete and pins the default payment method on success', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockSetupIntentsRetrieve.mockResolvedValue({
      id: 'seti_happy',
      status: 'succeeded',
      payment_method: 'pm_happy_path',
      metadata: { farmId: String(seededFarmId) },
      customer: 'cus_happy_path',
    });

    const result = await recordAchSetupComplete('seti_happy');
    expect(result).toEqual({});

    const [row] = await db
      .select()
      .from(farmSubscriptionTable)
      .where(eq(farmSubscriptionTable.farmId, seededFarmId));

    expect(row.status).toBe('bank_setup_complete');
    expect(row.stripeSubscriptionId).toBe('seti_happy');
    expect(row.stripePriceId).toBe('pm_happy_path');

    expect(mockSetCustomerDefaultPaymentMethod).toHaveBeenCalledWith(
      'cus_happy_path',
      'pm_happy_path'
    );
  });

  it('accepts an expanded payment_method object (not just a string ID)', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    mockSetupIntentsRetrieve.mockResolvedValue({
      id: 'seti_expanded',
      status: 'succeeded',
      payment_method: { id: 'pm_expanded' },
      metadata: { farmId: String(seededFarmId) },
      customer: { id: 'cus_expanded' },
    });

    await recordAchSetupComplete('seti_expanded');

    const [row] = await db
      .select()
      .from(farmSubscriptionTable)
      .where(eq(farmSubscriptionTable.farmId, seededFarmId));
    expect(row.stripePriceId).toBe('pm_expanded');
    expect(mockSetCustomerDefaultPaymentMethod).toHaveBeenCalledWith(
      'cus_expanded',
      'pm_expanded'
    );
  });

  it('throws an authorization error for viewers', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });
    await db
      .update(userTable)
      .set({ role: 'Viewer' })
      .where(eq(userTable.email, testUserEmail));

    await expect(recordAchSetupComplete('seti_anything')).rejects.toThrow(
      'You do not have permission to edit farm information'
    );
    expect(mockSetupIntentsRetrieve).not.toHaveBeenCalled();
  });
});
