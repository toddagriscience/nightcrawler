// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureApprovedApplicantAuthSession } from './auth-server';

const { getClaims, signInWithPassword, createUser, listUsers, updateUserById } =
  vi.hoisted(() => ({
    getClaims: vi.fn(),
    signInWithPassword: vi.fn(),
    createUser: vi.fn(),
    listUsers: vi.fn(),
    updateUserById: vi.fn(),
  }));

vi.mock('./supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getClaims, signInWithPassword },
  })),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { admin: { createUser, listUsers, updateUserById } },
  })),
}));

describe('ensureApprovedApplicantAuthSession', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PROJECT_ID', 'test-project');
    vi.stubEnv('SUPABASE_SECRET_KEY', 'test-key');
    getClaims.mockResolvedValue({ data: { claims: null }, error: null });
    signInWithPassword.mockResolvedValue({ data: null, error: null });
    signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: new Error('Invalid credentials'),
    });
    createUser.mockResolvedValue({
      error: new Error('User already registered'),
    });
    listUsers.mockResolvedValue({
      data: {
        users: [
          { id: 'test-user', email: 'john@example.com', user_metadata: {} },
        ],
      },
      error: null,
    });
    updateUserById.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not reset a completed applicant password after session loss', async () => {
    listUsers.mockResolvedValue({
      data: {
        users: [
          {
            id: 'test-user',
            email: 'john@example.com',
            user_metadata: {
              onboarding_applicant: true,
              onboarding_password_set: true,
              onboarding_application_id: 42,
            },
          },
        ],
      },
      error: null,
    });

    await expect(
      ensureApprovedApplicantAuthSession(
        'john@example.com',
        'Changed1!',
        'John'
      )
    ).rejects.toThrow('Sign in with that password');

    expect(signInWithPassword).toHaveBeenCalledTimes(1);
    expect(updateUserById).not.toHaveBeenCalled();
  });

  it('allows an existing password to restore the session without an admin update', async () => {
    signInWithPassword.mockReset();
    signInWithPassword.mockResolvedValue({ data: null, error: null });

    await expect(
      ensureApprovedApplicantAuthSession(
        'john@example.com',
        'Existing1!',
        'John'
      )
    ).resolves.toBeUndefined();

    expect(createUser).not.toHaveBeenCalled();
    expect(listUsers).not.toHaveBeenCalled();
    expect(updateUserById).not.toHaveBeenCalled();
  });

  it('still activates an invited applicant whose password is not complete', async () => {
    await expect(
      ensureApprovedApplicantAuthSession(
        'john@example.com',
        'Password1!',
        'John'
      )
    ).resolves.toBeUndefined();

    expect(updateUserById).toHaveBeenCalledWith(
      'test-user',
      expect.objectContaining({ password: 'Password1!', email_confirm: true })
    );
    expect(signInWithPassword).toHaveBeenCalledTimes(2);
  });

  it('rejects another account session before changing credentials', async () => {
    getClaims.mockResolvedValue({
      data: { claims: { email: 'other@example.com' } },
      error: null,
    });

    await expect(
      ensureApprovedApplicantAuthSession(
        'john@example.com',
        'Password1!',
        'John'
      )
    ).rejects.toThrow('different email');

    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
    expect(updateUserById).not.toHaveBeenCalled();
  });
});
