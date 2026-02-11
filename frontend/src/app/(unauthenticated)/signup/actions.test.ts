// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farm, user } from '@/lib/db/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signUp } from './actions';

const mockSignUp = vi.fn();

vi.mock('@/lib/supabase/server', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/supabase/server')>();
  return {
    ...actual,
    createClient: vi.fn(() => ({
      auth: {
        signUp: mockSignUp,
      },
    })),
  };
});

const { db } = await vi.hoisted(async () => {
  const { drizzle } = await import('drizzle-orm/pglite');
  const schema = await import('@/lib/db/schema');
  const { migrate } = await import('drizzle-orm/pglite/migrator');

  const db = drizzle({ schema, casing: 'snake_case' });
  await migrate(db, { migrationsFolder: 'drizzle' });

  return { db };
});

vi.mock('@/lib/db/schema/connection', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/lib/db/schema/connection')>()),
    db,
  };
});

describe('signUp', () => {
  beforeEach(async () => {
    mockSignUp.mockReset();
    // Clean up any existing data
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(user);
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(farm);
  });

  const createValidFormData = () => {
    const formData = new FormData();
    formData.set('firstName', 'John');
    formData.set('lastName', 'Doe');
    formData.set('farmName', 'Green Acres');
    formData.set('email', 'john@example.com');
    formData.set('phone', '5551234567');
    formData.set('password', 'securePassword123');
    return formData;
  };

  describe('validation', () => {
    it('returns error when firstName is missing', async () => {
      const formData = createValidFormData();
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      formData.delete('firstName');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when lastName is missing', async () => {
      const formData = createValidFormData();
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      formData.delete('lastName');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when farmName is missing', async () => {
      const formData = createValidFormData();
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      formData.delete('farmName');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when email is missing', async () => {
      const formData = createValidFormData();
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      formData.delete('email');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when email is invalid', async () => {
      const formData = createValidFormData();
      formData.set('email', 'not-an-email');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when phone is invalid', async () => {
      const formData = createValidFormData();
      formData.set('phone', 'invalid-phone');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when password is missing', async () => {
      const formData = createValidFormData();
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      formData.delete('password');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('returns error when password is too short', async () => {
      const formData = createValidFormData();
      formData.set('password', 'short');

      const result = await signUp(null, formData);

      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });
  });

  describe('Supabase signup', () => {
    it('returns error when Supabase signup fails', async () => {
      mockSignUp.mockResolvedValue({
        data: null,
        error: new Error('User already exists'),
      });

      const formData = createValidFormData();
      const result = await signUp(null, formData);

      expect(result.error).toBe('User already exists');
      expect(result.data).toBeUndefined();
    });

    it('returns error when Supabase returns an AuthError', async () => {
      const authError = new Error('Email rate limit exceeded');
      mockSignUp.mockResolvedValue({
        data: null,
        error: authError,
      });

      const formData = createValidFormData();
      const result = await signUp(null, formData);

      expect(result.error).toBe('Email rate limit exceeded');
      expect(result.data).toBeUndefined();
    });
  });

  describe('successful signup', () => {
    it('creates farm and user records on successful signup', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'supabase-user-id' } },
        error: null,
      });

      const formData = createValidFormData();
      const result = await signUp(null, formData);

      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();

      const data = result.data as {
        user: typeof user.$inferSelect;
        farm: { id: number };
      };
      expect(data.user).toBeDefined();
      expect(data.farm).toBeDefined();

      // Verify farm was created
      const farms = await db.select().from(farm);
      expect(farms).toHaveLength(1);
      expect(farms[0].informalName).toBe('Green Acres');

      // Verify user was created with correct data
      const users = await db.select().from(user);
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe('John');
      expect(users[0].lastName).toBe('Doe');
      expect(users[0].email).toBe('john@example.com');
      expect(users[0].role).toBe('Admin');
      expect(users[0].farmId).toBe(farms[0].id);
    });

    it('returns the created user and farm data', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'supabase-user-id' } },
        error: null,
      });

      const formData = createValidFormData();
      const result = await signUp(null, formData);

      const data = result.data as {
        user: typeof user.$inferSelect;
        farm: { id: number };
      };
      expect(data.user.firstName).toBe('John');
      expect(data.user.lastName).toBe('Doe');
      expect(data.user.email).toBe('john@example.com');
      // Farm returning only includes id
      expect(data.farm.id).toBeDefined();
    });

    it('handles phone number preprocessing correctly', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'supabase-user-id' } },
        error: null,
      });

      const formData = createValidFormData();
      formData.set('phone', '555-123-4567');

      const result = await signUp(null, formData);

      expect(result.error).toBeNull();

      const users = await db.select().from(user);
      // Phone should be preprocessed to E.164 format
      expect(users[0].phone).toMatch(/^\+1\d{10}$/);
    });
  });
});
