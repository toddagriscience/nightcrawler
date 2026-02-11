// Copyright © Todd Agriscience, Inc. All rights reserved.

import { AuthError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import {
  checkAuthenticated,
  getUserEmail,
  inviteUser,
  login,
  logout,
  signUpUser,
} from './auth';

vitest.mock(import('./logger'), async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    warn: vitest.fn(),
  };
});

const mockSignInWithPassword = vitest.fn();
const mockGetUser = vitest.fn();
const mockSignOut = vitest.fn();
const mockGetClaims = vitest.fn();
const mockSignUp = vitest.fn();
const mockInviteUserByEmail = vitest.fn();

vitest.mock('./supabase/client', async (importActual) => {
  const actual = await importActual<typeof import('./supabase/client')>();
  return {
    ...actual,
    createClient: vitest.fn(() => ({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    })),
  };
});

vitest.mock('./supabase/server', async (importActual) => {
  const actual = await importActual<typeof import('./supabase/server')>();
  return {
    ...actual,
    createClient: vitest.fn(() => ({
      auth: {
        getClaims: mockGetClaims,
        signUp: mockSignUp,
        admin: {
          inviteUserByEmail: mockInviteUserByEmail,
        },
      },
    })),
  };
});

const mockRedirect = vitest.fn();
vitest.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path),
}));

describe('login', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('returns data and no error on successful login', async () => {
    const fakeData = { session: 'abc' };

    mockSignInWithPassword.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    const result = await login('test@example.com', 'password');

    expect(result.error).toBeNull();
    expect(result.data).toEqual(fakeData);
  });

  it('returns the error when Supabase returns one', async () => {
    const fakeError = new AuthError('Invalid credentials');

    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: fakeError,
    });

    const result = await login('bad@example.com', 'wrong');

    expect(result.error).toBe(fakeError);
  });

  it('returns default error when an exception is thrown', async () => {
    mockSignInWithPassword.mockRejectedValue(new Error('network'));

    const result = await login('x', 'y');

    expect(result.error).toBeInstanceOf(Error);
  });
});

describe('logout', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: '123' } },
    });
  });

  it('logs out when authenticated and redirects', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await logout();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith('/');
  });

  it('does not log out when not authenticated, but still redirects', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
    });

    await logout();

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('logs warning on Supabase signOut error but still redirects', async () => {
    const fakeError = new AuthError('signout failed');

    mockSignOut.mockResolvedValue({ error: fakeError });

    await logout();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('returns AuthError when an exception is thrown and does not redirect', async () => {
    const result = await logout();

    expect(result?.error).toBeInstanceOf(AuthError);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

describe('checkAuthenticated', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('returns true when a user exists', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '123' } },
    });

    const result = await checkAuthenticated();

    expect(result).toBe(true);
  });

  it('returns false when no user exists', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
    });

    const result = await checkAuthenticated();

    expect(result).toBe(false);
  });
});

describe('getUserEmail', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('returns email when claims exist', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { email: 'user@example.com' } },
      error: null,
    });

    const result = await getUserEmail();

    expect(result).toBe('user@example.com');
  });

  it('returns null when error occurs', async () => {
    mockGetClaims.mockResolvedValue({
      data: null,
      error: new Error('Failed to get claims'),
    });

    const result = await getUserEmail();

    expect(result).toBeNull();
  });

  it('returns null when claims is null', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: null },
      error: null,
    });

    const result = await getUserEmail();

    expect(result).toBeNull();
  });

  it('returns null when claims has no email', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: {} },
      error: null,
    });

    const result = await getUserEmail();

    expect(result).toBeNull();
  });
});

describe('signUpUser', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('returns data on successful signup', async () => {
    const fakeData = { user: { id: 'user-123', email: 'test@example.com' } };

    mockSignUp.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    const result = await signUpUser(
      'test@example.com',
      'securePassword123',
      'Oscar'
    );

    expect(result).toEqual(fakeData);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'securePassword123',
      options: {
        emailRedirectTo: 'https://toddagriscience.com/login',
        data: {
          first_name: 'Oscar',
          name: 'Oscar',
        },
      },
    });
  });

  it('returns error when Supabase signup fails', async () => {
    const fakeError = new AuthError('User already registered');

    mockSignUp.mockResolvedValue({
      data: null,
      error: fakeError,
    });

    const result = await signUpUser(
      'existing@example.com',
      'password123',
      'Oscar'
    );

    expect(result).toBe(fakeError);
  });

  it('uses provided name in signup options', async () => {
    const fakeData = { user: { id: 'user-456' } };

    mockSignUp.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    const result = await signUpUser(
      'john@example.com',
      'password123',
      'John Doe'
    );

    expect(result).toEqual(fakeData);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
      options: {
        emailRedirectTo: 'https://toddagriscience.com/login',
        data: {
          name: 'John Doe',
          first_name: 'John Doe',
        },
      },
    });
  });
});

describe('inviteUser', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';
  });

  it('returns data on successful invite', async () => {
    const fakeData = { user: { id: 'user-123', email: 'invited@example.com' } };

    mockInviteUserByEmail.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    const result = await inviteUser('invited@example.com', 'Jane');

    expect(result).toEqual(fakeData);
    expect(mockInviteUserByEmail).toHaveBeenCalledWith('invited@example.com', {
      redirectTo: 'https://toddagriscience.com/auth/accept-invite',
      data: {
        first_name: 'Jane',
        name: 'Jane',
      },
    });
  });

  it('returns error when invite fails', async () => {
    const fakeError = new AuthError('User already exists');

    mockInviteUserByEmail.mockResolvedValue({
      data: null,
      error: fakeError,
    });

    const result = await inviteUser('existing@example.com', 'John');

    expect(result).toBe(fakeError);
  });

  it('includes correct redirectTo and username in invite options', async () => {
    const fakeData = { user: { id: 'user-456' } };

    mockInviteUserByEmail.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    await inviteUser('new@example.com', 'Bob');

    expect(mockInviteUserByEmail).toHaveBeenCalledWith(
      'new@example.com',
      expect.objectContaining({
        redirectTo: 'https://toddagriscience.com/auth/accept-invite',
      })
    );
  });

  it('includes first_name and name in data options', async () => {
    const fakeData = { user: { id: 'user-789' } };

    mockInviteUserByEmail.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    await inviteUser('alice@example.com', 'Alice');

    expect(mockInviteUserByEmail).toHaveBeenCalledWith(
      'alice@example.com',
      expect.objectContaining({
        data: {
          first_name: 'Alice',
          name: 'Alice',
        },
      })
    );
  });
});
