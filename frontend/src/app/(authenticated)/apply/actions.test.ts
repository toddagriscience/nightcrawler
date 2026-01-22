// Copyright © Todd Agriscience, Inc. All rights reserved.

import { user } from '@/lib/db/schema/user';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import {
  saveApplication,
  submitApplication,
  inviteUserToFarm,
} from './actions';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';
import * as nextHeaders from 'next/headers';

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
vi.mock('@/lib/auth', async () => {
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

const { db, mockSubmitToGoogleSheets, testUserEmail } = await vi.hoisted(
  async () => {
    const { drizzle } = await import('drizzle-orm/pglite');
    const { migrate } = await import('drizzle-orm/pglite/migrator');
    const { seed } = await import('drizzle-seed');
    const schema = await import('@/lib/db/schema');
    const { user, farm } = await import('@/lib/db/schema');

    const db = drizzle({ schema });
    await migrate(db, { migrationsFolder: 'drizzle' });
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

    const testUserEmail = 'testtest@example.com';
    const mockSubmitToGoogleSheets = vi.fn();

    return {
      db,
      mockSubmitToGoogleSheets,
      testUserEmail,
    };
  }
);

vi.mock('@/lib/db/schema/connection', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/lib/db/schema/connection')>()),
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

describe('saveApplication', () => {
  it('saves with no information given', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    const result = await saveApplication({ farmId: 1 });
    expect(result.error).toBeNull();
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
    expect(result.error).toBeNull();
  });

  it('throws error with incorrect email', async () => {
    mockGetClaims.mockReturnValue({
      data: { email: '' },
      error: null,
    });

    const result = await saveApplication({ farmId: 1 });
    expect(result.error).not.toBeNull();
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

    mockSubmitToGoogleSheets.mockResolvedValue(undefined);

    const result = await submitApplication();
    expect(result.error).toBeNull();
    expect(mockSubmitToGoogleSheets).toHaveBeenCalledTimes(1);
  });
});

describe('inviteUserToFarm', () => {
  afterEach(async () => {
    mockInviteUser.mockReset();
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

    expect(result.error).toBeNull();
    expect(mockInviteUser).toHaveBeenCalledWith(newUserEmail, 'Jane');
  });

  it('returns error when user is not authenticated', async () => {
    mockGetClaims.mockReturnValue({
      data: null,
      error: new Error('Not authenticated'),
    });

    const userData = createValidUserData();
    const result = await inviteUserToFarm(userData);

    expect(result.error).toBe("No email registered with this user's account");
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it('returns error when data is invalid (missing required fields)', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    // Missing required fields - only firstName provided
    const invalidData = {
      firstName: 'John',
    } as Parameters<typeof inviteUserToFarm>[0];

    const result = await inviteUserToFarm(invalidData);

    expect(result.error).not.toBeNull();
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it('returns error when inviteUser fails', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    mockInviteUser.mockResolvedValue(new Error('User already exists'));

    const userData = createValidUserData();
    const result = await inviteUserToFarm(userData);

    expect(result.error).toBe('User already exists');
  });

  it('returns error when current user is not found', async () => {
    // Use an email that doesn't exist in the database
    mockGetClaims.mockReturnValue({
      data: { claims: { email: 'nonexistent@example.com' } },
      error: null,
    });

    const userData = createValidUserData();
    const result = await inviteUserToFarm(userData);

    expect(result.error).toBe('User not found');
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it('creates user record in database after successful invite', async () => {
    mockGetClaims.mockReturnValue({
      data: { claims: { email: testUserEmail } },
      error: null,
    });

    mockInviteUser.mockResolvedValue({ user: { id: 'supabase-user-id' } });

    const uniqueEmail = `invited-${Date.now()}@example.com`;
    const userData = createValidUserData({ email: uniqueEmail });
    const result = await inviteUserToFarm(userData);

    expect(result.error).toBeNull();

    // Verify the new user was created in the database
    const { eq } = await import('drizzle-orm');
    const [newUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, uniqueEmail))
      .limit(1);

    expect(newUser).toBeDefined();
    expect(newUser.firstName).toBe('Jane');
    expect(newUser.lastName).toBe('Smith');
    expect(newUser.email).toBe(uniqueEmail);
    expect(newUser.role).toBe('Viewer');
  });

  it('invites user with Admin role', async () => {
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
    const result = await inviteUserToFarm(userData);

    expect(result.error).toBeNull();
    expect(mockInviteUser).toHaveBeenCalledWith(uniqueEmail, 'Admin');
  });
});
