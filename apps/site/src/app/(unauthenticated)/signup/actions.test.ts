// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ensureApprovedApplicantAuthSession } from '@/lib/auth-server';
import { enforceRateLimit, signupRateLimit } from '@/lib/rate-limit';
import {
  completeFormSubmissionSignup,
  isFormSubmissionSignupAlreadyCompleted,
  resolveSignupContext,
} from '@nightcrawler/db/queries';
import { farm, standardValues, user } from '@nightcrawler/db/schema';
import { gt, type SQLWrapper } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signUp as signUpAction } from './actions';

const { authState, getUser, updateUser, signInWithPassword } = vi.hoisted(
  () => ({
    authState: {
      email: 'john@example.com',
      metadata: {} as Record<string, unknown>,
    },
    getUser: vi.fn(),
    updateUser: vi.fn(),
    signInWithPassword: vi.fn(),
  })
);

vi.mock('@/lib/auth-server', () => ({
  ensureApprovedApplicantAuthSession: vi.fn(),
}));

vi.mock('@nightcrawler/db/utils/send-approved-applicant-invite', () => ({
  sendApprovedApplicantInvite: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  enforceRateLimit: vi.fn(),
  publicEmailRateLimit: vi.fn(),
  signupRateLimit: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser, updateUser, signInWithPassword },
  })),
}));

vi.mock('@nightcrawler/db/queries', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@nightcrawler/db/queries')>();
  return {
    ...actual,
    resolveSignupContext: vi.fn(),
    completeFormSubmissionSignup: vi.fn(),
    isFormSubmissionSignupAlreadyCompleted: vi.fn(),
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

  const pglite = new PGlite({ extensions: { vector } });
  await pglite.waitReady;
  await pglite.exec('CREATE EXTENSION IF NOT EXISTS vector;');

  const { drizzle } = await import('drizzle-orm/pglite');
  const schema = await import('@nightcrawler/db/schema');
  const { migrate } = await import('drizzle-orm/pglite/migrator');

  const db = drizzle(pglite, { schema, casing: 'snake_case' });
  await migrate(db, { migrationsFolder: '../../packages/db/drizzle' });

  return { db };
});

vi.mock('@nightcrawler/db/schema/connection', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@nightcrawler/db/schema/connection')
  >()),
  db,
}));

const persistTransaction = db.transaction.bind(db);
const transaction = vi.spyOn(db, 'transaction');
const heldSignupLocks = new Set<number>();
const lockAttempts = vi.fn();

// PGlite has one connection, so simulate only the outer PostgreSQL advisory
// transaction. Nested record writes still use its real database transaction.
function signUp(...args: Parameters<typeof signUpAction>) {
  transaction.mockImplementationOnce(async (callback) => {
    let ownedApplicationId: number | undefined;
    const execute = async (statement: SQLWrapper) => {
      const query = new PgDialect().sqlToQuery(statement.getSQL());
      expect(query.sql).toMatch(
        /SELECT pg_try_advisory_xact_lock\(1148, \$1\) AS acquired/
      );
      expect(query.params).toHaveLength(1);
      const applicationId = query.params[0];
      expect(typeof applicationId).toBe('number');
      const acquired = !heldSignupLocks.has(applicationId as number);
      lockAttempts(applicationId, acquired);
      if (acquired) {
        ownedApplicationId = applicationId as number;
        heldSignupLocks.add(ownedApplicationId);
      }
      return { rows: [{ acquired }], fields: [], affectedRows: 0 };
    };

    try {
      return await callback({ execute } as unknown as Parameters<
        Parameters<typeof db.transaction>[0]
      >[0]);
    } finally {
      if (ownedApplicationId !== undefined) {
        // This is an in-memory lock set, not a database delete.
        // eslint-disable-next-line drizzle/enforce-delete-with-where
        heldSignupLocks.delete(ownedApplicationId);
      }
    }
  });
  return signUpAction(...args);
}

describe('signUp', () => {
  const signupContext = {
    applicationId: 42,
    token: 'test-signup-token',
    email: 'john@example.com',
    prefill: {
      firstName: 'John',
      lastName: 'Doe',
      farmName: 'Green Acres',
      email: 'john@example.com',
      phone: '5551234567',
    },
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    transaction.mockImplementation(persistTransaction);
    heldSignupLocks.clear();
    authState.email = 'john@example.com';
    authState.metadata = {};
    getUser.mockImplementation(async () => ({
      data: {
        user: { email: authState.email, user_metadata: authState.metadata },
      },
      error: null,
    }));
    updateUser.mockImplementation(
      async (input: { data: Record<string, unknown>; password?: string }) => {
        authState.metadata = { ...authState.metadata, ...input.data };
        return { error: null };
      }
    );
    signInWithPassword.mockResolvedValue({ error: null });
    vi.mocked(ensureApprovedApplicantAuthSession).mockResolvedValue(undefined);
    vi.mocked(resolveSignupContext).mockResolvedValue(signupContext);
    vi.mocked(completeFormSubmissionSignup).mockResolvedValue(undefined);
    vi.mocked(isFormSubmissionSignupAlreadyCompleted).mockResolvedValue(false);
    vi.mocked(enforceRateLimit).mockResolvedValue(undefined);
    await db.delete(user).where(gt(user.id, 0));
    await db.delete(standardValues).where(gt(standardValues.farmId, 0));
    await db.delete(farm).where(gt(farm.id, 0));
  });

  const createFormData = () => {
    const formData = new FormData();
    formData.set('password', 'SecurePassword123!');
    formData.set('confirmPassword', 'SecurePassword123!');
    formData.set('applicationId', '42');
    formData.set('token', 'test-signup-token');
    return formData;
  };

  it('enforces the signup rate limit before looking up the application', async () => {
    vi.mocked(enforceRateLimit).mockRejectedValueOnce(
      new Error('Too many requests. Please try again shortly.')
    );

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Too many requests'
    );

    expect(enforceRateLimit).toHaveBeenCalledWith(signupRateLimit);
    expect(resolveSignupContext).not.toHaveBeenCalled();
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
  });

  it.each(['applicationId', 'token'])(
    'requires the approved application %s',
    async (field) => {
      const formData = createFormData();
      formData.set(field, '');

      await expect(signUp(null, formData)).rejects.toThrow(
        'valid onboarding link'
      );
      expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    }
  );

  it.each(['42trailing', '0', '-1', '1.5', '2147483648'])(
    'rejects invalid application id %s',
    async (applicationId) => {
      const formData = createFormData();
      formData.set('applicationId', applicationId);

      await expect(signUp(null, formData)).rejects.toThrow(
        'invalid or expired'
      );
      expect(resolveSignupContext).not.toHaveBeenCalled();
    }
  );

  it('rejects an invalid or expired signup token', async () => {
    vi.mocked(resolveSignupContext).mockResolvedValue(null);

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'invalid or expired'
    );
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it.each([
    ['Short1!', 'at least 8 characters'],
    ['nouppercase1!', 'uppercase letter'],
    ['NoNumbers!', 'number'],
    ['NoSpecial123', 'special character'],
  ])(
    'rejects a password that fails the checklist: %s',
    async (password, error) => {
      const formData = createFormData();
      formData.set('password', password);
      formData.set('confirmPassword', password);

      await expect(signUp(null, formData)).rejects.toThrow(error);
      expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    }
  );

  it('requires a matching password confirmation', async () => {
    const formData = createFormData();
    formData.set('confirmPassword', 'Mismatch1!');

    await expect(signUp(null, formData)).rejects.toThrow(
      'Passwords must match'
    );
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
  });

  it('uses only the stored application profile and returns without redirecting', async () => {
    const formData = createFormData();
    formData.set('firstName', 'Tampered');
    formData.set('email', 'other@example.com');
    formData.set('farmName', 'Other farm');

    await expect(signUp(null, formData)).resolves.toEqual({ data: null });

    expect(ensureApprovedApplicantAuthSession).toHaveBeenCalledWith(
      'john@example.com',
      'SecurePassword123!',
      'John'
    );
    expect(updateUser).toHaveBeenCalledWith({
      password: 'SecurePassword123!',
      data: {
        first_name: 'John',
        name: 'John',
        email_verified: true,
        onboarding_applicant: true,
        onboarding_application_id: 42,
        onboarding_password_set: true,
        onboarding_team_step_done: false,
        onboarding_payment_continued: false,
      },
    });

    const users = await db.select().from(user);
    const farms = await db.select().from(farm);
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+15551234567',
      role: 'Admin',
      farmId: farms[0].id,
    });
    expect(farms).toHaveLength(1);
    expect(farms[0].informalName).toBe('Green Acres');
    expect(completeFormSubmissionSignup).toHaveBeenCalledWith(42, farms[0].id);
    expect(updateUser.mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(completeFormSubmissionSignup).mock.invocationCallOrder[0]
    );
  });

  it('rejects overlapping requests until password and token completion both finish', async () => {
    let releasePassword!: () => void;
    let passwordStarted!: () => void;
    const passwordPending = new Promise<void>((resolve) => {
      releasePassword = resolve;
    });
    const passwordReached = new Promise<void>((resolve) => {
      passwordStarted = resolve;
    });
    let releaseCompletion!: () => void;
    let completionStarted!: () => void;
    const completionPending = new Promise<void>((resolve) => {
      releaseCompletion = resolve;
    });
    const completionReached = new Promise<void>((resolve) => {
      completionStarted = resolve;
    });
    updateUser.mockImplementationOnce(async (input) => {
      passwordStarted();
      await passwordPending;
      authState.metadata = { ...authState.metadata, ...input.data };
      return { error: null };
    });
    vi.mocked(completeFormSubmissionSignup).mockImplementationOnce(async () => {
      completionStarted();
      await completionPending;
    });

    const winner = signUp(null, createFormData());
    await passwordReached;
    try {
      await expect(signUp(null, createFormData())).rejects.toThrow(
        'Account setup is already in progress'
      );
      expect(resolveSignupContext).toHaveBeenCalledTimes(1);
      expect(updateUser).toHaveBeenCalledTimes(1);
      releasePassword();
      await completionReached;

      await expect(signUp(null, createFormData())).rejects.toThrow(
        'Account setup is already in progress'
      );
      expect(resolveSignupContext).toHaveBeenCalledTimes(1);
      expect(completeFormSubmissionSignup).toHaveBeenCalledTimes(1);
      expect(lockAttempts.mock.calls).toEqual([
        [42, true],
        [42, false],
        [42, false],
      ]);
    } finally {
      releasePassword();
      releaseCompletion();
      await winner;
    }
    expect(heldSignupLocks.size).toBe(0);
    expect(await db.select().from(user)).toHaveLength(1);
    expect(await db.select().from(farm)).toHaveLength(1);
  });

  it('rechecks the consumed token after a winning request and preserves later progress', async () => {
    vi.mocked(completeFormSubmissionSignup).mockImplementationOnce(async () => {
      vi.mocked(resolveSignupContext).mockResolvedValue(null);
      vi.mocked(isFormSubmissionSignupAlreadyCompleted).mockResolvedValue(true);
    });
    await expect(signUp(null, createFormData())).resolves.toEqual({
      data: null,
    });
    authState.metadata.onboarding_team_step_done = true;
    authState.metadata.onboarding_payment_continued = true;
    const lateRequest = createFormData();
    lateRequest.set('password', 'LatePassword123!');
    lateRequest.set('confirmPassword', 'LatePassword123!');

    await expect(signUp(null, lateRequest)).resolves.toEqual({ data: null });

    expect(lockAttempts.mock.calls).toEqual([
      [42, true],
      [42, true],
    ]);
    expect(resolveSignupContext).toHaveBeenCalledTimes(2);
    expect(isFormSubmissionSignupAlreadyCompleted).toHaveBeenCalledWith(
      42,
      'test-signup-token',
      'john@example.com'
    );
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(ensureApprovedApplicantAuthSession).toHaveBeenCalledTimes(1);
    expect(authState.metadata.onboarding_team_step_done).toBe(true);
    expect(authState.metadata.onboarding_payment_continued).toBe(true);
    expect(await db.select().from(user)).toHaveLength(1);
    expect(await db.select().from(farm)).toHaveLength(1);
  });

  it('does not fill missing application fields from untrusted form data', async () => {
    vi.mocked(resolveSignupContext).mockResolvedValue({
      ...signupContext,
      prefill: { ...signupContext.prefill, firstName: undefined },
    });
    const formData = createFormData();
    formData.set('firstName', 'Forged name');

    await expect(signUp(null, formData)).rejects.toThrow(
      'First name is required'
    );
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
  });

  it('rejects a session for another applicant before creating records', async () => {
    authState.email = 'other@example.com';

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'different email'
    );
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    expect(await db.select().from(user)).toHaveLength(0);
  });

  it('requires the expected authenticated identity after bootstrap', async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    getUser.mockResolvedValueOnce({
      data: { user: { email: 'other@example.com', user_metadata: {} } },
      error: null,
    });

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Unable to start your session'
    );
    expect(updateUser).not.toHaveBeenCalled();
    expect(await db.select().from(farm)).toHaveLength(0);
  });

  it('keeps the token usable after a password failure and reuses records on retry', async () => {
    updateUser.mockResolvedValueOnce({
      error: { message: 'Password update failed' },
    });

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Password update failed'
    );
    expect(completeFormSubmissionSignup).not.toHaveBeenCalled();
    expect(authState.metadata.onboarding_password_set).toBeUndefined();

    await expect(signUp(null, createFormData())).resolves.toEqual({
      data: null,
    });
    expect(await db.select().from(farm)).toHaveLength(1);
    expect(await db.select().from(user)).toHaveLength(1);
    expect(completeFormSubmissionSignup).toHaveBeenCalledTimes(1);
  });

  it('verifies an already-set bootstrap password before saving its metadata', async () => {
    updateUser.mockResolvedValueOnce({
      error: { message: 'Use a different password', code: 'same_password' },
    });

    await expect(signUp(null, createFormData())).resolves.toEqual({
      data: null,
    });

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'SecurePassword123!',
    });
    expect(updateUser.mock.calls[1][0]).not.toHaveProperty('password');
    expect(authState.metadata.onboarding_password_set).toBe(true);
    expect(completeFormSubmissionSignup).toHaveBeenCalledTimes(1);
  });

  it('does not mark a bootstrap password complete when credential verification fails', async () => {
    updateUser.mockResolvedValueOnce({
      error: { message: 'Use a different password', code: 'same_password' },
    });
    signInWithPassword.mockResolvedValueOnce({
      error: { message: 'Unable to verify password' },
    });

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Unable to verify password'
    );
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(completeFormSubmissionSignup).not.toHaveBeenCalled();
  });

  it('does not consume the link if saving bootstrap metadata fails', async () => {
    updateUser.mockResolvedValueOnce({
      error: { message: 'Use a different password', code: 'same_password' },
    });
    updateUser.mockResolvedValueOnce({
      error: { message: 'Metadata update failed' },
    });

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Metadata update failed'
    );
    expect(completeFormSubmissionSignup).not.toHaveBeenCalled();
    expect(authState.metadata.onboarding_password_set).toBeUndefined();
  });

  it('resumes interrupted token completion without resetting password or later progress', async () => {
    vi.mocked(completeFormSubmissionSignup).mockRejectedValueOnce(
      new Error('Token completion temporarily unavailable')
    );

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Token completion temporarily unavailable'
    );
    authState.metadata.onboarding_team_step_done = true;
    authState.metadata.onboarding_payment_continued = true;
    const retryForm = createFormData();
    retryForm.set('password', 'ChangedPassword123!');
    retryForm.set('confirmPassword', 'ChangedPassword123!');

    await expect(signUp(null, retryForm)).resolves.toEqual({ data: null });

    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(ensureApprovedApplicantAuthSession).toHaveBeenCalledTimes(1);
    expect(authState.metadata.onboarding_team_step_done).toBe(true);
    expect(authState.metadata.onboarding_payment_continued).toBe(true);
    expect(await db.select().from(farm)).toHaveLength(1);
    expect(await db.select().from(user)).toHaveLength(1);
    expect(completeFormSubmissionSignup).toHaveBeenCalledTimes(2);
  });

  it('preserves completed password and progress after restoring an expired session', async () => {
    vi.mocked(completeFormSubmissionSignup).mockRejectedValueOnce(
      new Error('Token completion temporarily unavailable')
    );
    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Token completion temporarily unavailable'
    );
    authState.metadata.onboarding_team_step_done = true;
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    await expect(signUp(null, createFormData())).resolves.toEqual({
      data: null,
    });

    expect(ensureApprovedApplicantAuthSession).toHaveBeenCalledTimes(2);
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(authState.metadata.onboarding_team_step_done).toBe(true);
    expect(await db.select().from(farm)).toHaveLength(1);
  });

  it('does not reset a completed password through another application link', async () => {
    authState.metadata = {
      onboarding_applicant: true,
      onboarding_password_set: true,
      onboarding_application_id: 17,
    };

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Your password has already been set'
    );

    expect(updateUser).not.toHaveBeenCalled();
    expect(completeFormSubmissionSignup).not.toHaveBeenCalled();
    expect(await db.select().from(user)).toHaveLength(0);
  });

  it('finishes an active saved-password signup without requiring password fields', async () => {
    vi.mocked(completeFormSubmissionSignup).mockRejectedValueOnce(
      new Error('Token completion temporarily unavailable')
    );
    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Token completion temporarily unavailable'
    );
    authState.metadata.onboarding_team_step_done = true;
    authState.metadata.onboarding_payment_continued = true;
    const recoveryForm = new FormData();
    recoveryForm.set('applicationId', '42');
    recoveryForm.set('token', 'test-signup-token');
    recoveryForm.set('firstName', 'Tampered');
    vi.mocked(resolveSignupContext).mockResolvedValue({
      ...signupContext,
      prefill: { ...signupContext.prefill, firstName: undefined },
    });

    await expect(signUp(null, recoveryForm)).resolves.toEqual({ data: null });

    expect(ensureApprovedApplicantAuthSession).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(completeFormSubmissionSignup).toHaveBeenCalledTimes(2);
    expect(authState.metadata.onboarding_team_step_done).toBe(true);
    expect(authState.metadata.onboarding_payment_continued).toBe(true);
    const users = await db.select().from(user);
    expect(users).toHaveLength(1);
    expect(users[0].firstName).toBe('John');
    expect(await db.select().from(farm)).toHaveLength(1);
  });

  it('cannot recover a saved password into a secondary user account', async () => {
    vi.mocked(completeFormSubmissionSignup).mockRejectedValueOnce(
      new Error('Token completion temporarily unavailable')
    );
    await expect(signUp(null, createFormData())).rejects.toThrow(
      'Token completion temporarily unavailable'
    );
    await db.update(user).set({ role: 'Viewer' }).where(gt(user.id, 0));
    const recoveryForm = new FormData();
    recoveryForm.set('applicationId', '42');
    recoveryForm.set('token', 'test-signup-token');

    await expect(signUp(null, recoveryForm)).rejects.toThrow(
      'Unable to resume onboarding'
    );

    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(completeFormSubmissionSignup).toHaveBeenCalledTimes(1);
  });

  it('does not recover a saved password with a mismatched authenticated email', async () => {
    authState.email = 'other@example.com';
    authState.metadata = {
      onboarding_applicant: true,
      onboarding_password_set: true,
      onboarding_application_id: 42,
    };
    const recoveryForm = new FormData();
    recoveryForm.set('applicationId', '42');
    recoveryForm.set('token', 'test-signup-token');

    await expect(signUp(null, recoveryForm)).rejects.toThrow('different email');

    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
    expect(completeFormSubmissionSignup).not.toHaveBeenCalled();
  });

  it('returns safely for a consumed link belonging to the authenticated applicant', async () => {
    vi.mocked(resolveSignupContext).mockResolvedValue(null);
    vi.mocked(isFormSubmissionSignupAlreadyCompleted).mockResolvedValue(true);

    await expect(signUp(null, createFormData())).resolves.toEqual({
      data: null,
    });

    expect(isFormSubmissionSignupAlreadyCompleted).toHaveBeenCalledWith(
      42,
      'test-signup-token',
      'john@example.com'
    );
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
    expect(completeFormSubmissionSignup).not.toHaveBeenCalled();
    expect(await db.select().from(user)).toHaveLength(0);
  });

  it('does not adopt a consumed link for an unauthenticated visitor', async () => {
    vi.mocked(resolveSignupContext).mockResolvedValue(null);
    getUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'invalid or expired'
    );
    expect(isFormSubmissionSignupAlreadyCompleted).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('does not adopt a consumed link belonging to a different email', async () => {
    vi.mocked(resolveSignupContext).mockResolvedValue(null);
    authState.email = 'other@example.com';
    vi.mocked(isFormSubmissionSignupAlreadyCompleted).mockResolvedValue(false);

    await expect(signUp(null, createFormData())).rejects.toThrow(
      'invalid or expired'
    );
    expect(isFormSubmissionSignupAlreadyCompleted).toHaveBeenCalledWith(
      42,
      'test-signup-token',
      'other@example.com'
    );
    expect(ensureApprovedApplicantAuthSession).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});
