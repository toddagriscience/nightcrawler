// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farm, standardValues, user } from '@nightcrawler/db/schema';
import { gt } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ensureApprovedApplicantAuthSession,
  getUserEmail,
  setPassword,
} from '@/lib/auth-server';
import { AuthResponseTypes } from '@/lib/types/auth';
import type { AuthResponse } from '@/lib/types/auth';
import { validateFormSubmissionSignupToken } from '@nightcrawler/db/queries';
import { signUp } from './actions';

/** Hoisted without importing `AuthResponseTypes` (imports are not initialized yet). */
const { successfulSetPasswordResponse } = vi.hoisted(() => ({
  successfulSetPasswordResponse: {
    error: null,
    responseType: 3,
  } satisfies AuthResponse,
}));

vi.mock('@/lib/auth-server', () => ({
  getUserEmail: vi.fn().mockResolvedValue(null),
  setPassword: vi.fn().mockResolvedValue(successfulSetPasswordResponse),
  ensureApprovedApplicantAuthSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@nightcrawler/db/utils/send-approved-applicant-invite', () => ({
  sendApprovedApplicantInvite: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      updateUser: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock('@nightcrawler/db/queries', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@nightcrawler/db/queries')>();
  return {
    ...actual,
    validateFormSubmissionSignupToken: vi.fn(),
    resolveSignupContext: vi.fn().mockResolvedValue(null),
    completeFormSubmissionSignup: vi.fn().mockResolvedValue(undefined),
  };
});

const { db } = await vi.hoisted(async () => {
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
  const schema = await import('@nightcrawler/db/schema');
  const { migrate } = await import('drizzle-orm/pglite/migrator');

  const db = drizzle(pglite, { schema, casing: 'snake_case' });
  await migrate(db, { migrationsFolder: '../../packages/db/drizzle' });

  return { db };
});

vi.mock('@nightcrawler/db/schema/connection', async (importOriginal) => {
  return {
    ...(await importOriginal<
      typeof import('@nightcrawler/db/schema/connection')
    >()),
    db,
  };
});

describe('signUp', () => {
  beforeEach(async () => {
    vi.mocked(getUserEmail).mockReset();
    vi.mocked(getUserEmail).mockResolvedValue('john@example.com');
    vi.mocked(setPassword).mockReset();
    vi.mocked(setPassword).mockResolvedValue(successfulSetPasswordResponse);
    vi.mocked(ensureApprovedApplicantAuthSession).mockReset();
    vi.mocked(ensureApprovedApplicantAuthSession).mockResolvedValue(undefined);
    vi.mocked(validateFormSubmissionSignupToken).mockReset();
    await db.delete(user).where(gt(user.id, 0));
    await db.delete(standardValues).where(gt(standardValues.farmId, 0));
    await db.delete(farm).where(gt(farm.id, 0));
  });

  const createApprovedApplicantFormData = (options?: {
    includeApplicationId?: boolean;
    includeToken?: boolean;
  }) => {
    const formData = new FormData();
    formData.set('firstName', 'John');
    formData.set('lastName', 'Doe');
    formData.set('farmName', 'Green Acres');
    formData.set('email', 'john@example.com');
    formData.set('phone', '5551234567');
    formData.set('password', 'securePassword123');
    if (options?.includeApplicationId !== false) {
      formData.set('applicationId', '42');
    }
    if (options?.includeToken !== false) {
      formData.set('token', 'test-signup-token');
    }
    return formData;
  };

  describe('validation', () => {
    it('throws when application id is missing', async () => {
      const formData = createApprovedApplicantFormData({
        includeApplicationId: false,
      });

      await expect(signUp(null, formData)).rejects.toThrow(
        'valid onboarding link'
      );
    });

    it('throws when signup token is missing', async () => {
      const formData = createApprovedApplicantFormData({ includeToken: false });

      await expect(signUp(null, formData)).rejects.toThrow(
        'valid onboarding link'
      );
    });

    it('throws when signup token validation fails', async () => {
      vi.mocked(validateFormSubmissionSignupToken).mockResolvedValue(null);

      const formData = createApprovedApplicantFormData();

      await expect(signUp(null, formData)).rejects.toThrow(
        'invalid or expired'
      );
    });
  });

  describe('approved applicant signup', () => {
    it('ensures auth session from application token before persisting records', async () => {
      vi.mocked(validateFormSubmissionSignupToken).mockResolvedValue({
        applicationId: 42,
        email: 'john@example.com',
      });

      const formData = createApprovedApplicantFormData();

      await expect(signUp(null, formData)).rejects.toThrow(
        'NEXT_REDIRECT:/apply'
      );

      expect(ensureApprovedApplicantAuthSession).toHaveBeenCalledWith(
        'john@example.com',
        'securePassword123',
        'John'
      );
    });

    it('persists farm and user before setting password and redirects to /apply', async () => {
      vi.mocked(validateFormSubmissionSignupToken).mockResolvedValue({
        applicationId: 42,
        email: 'john@example.com',
      });
      vi.mocked(setPassword).mockImplementation(async () => {
        const farms = await db.select().from(farm);
        expect(farms).toHaveLength(1);
        return successfulSetPasswordResponse;
      });

      const formData = createApprovedApplicantFormData();

      await expect(signUp(null, formData)).rejects.toThrow(
        'NEXT_REDIRECT:/apply'
      );

      expect(setPassword).toHaveBeenCalledWith('securePassword123');

      const users = await db.select().from(user);
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('john@example.com');
    });
  });
});
