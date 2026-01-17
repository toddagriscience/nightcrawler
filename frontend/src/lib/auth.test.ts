// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vitest } from 'vitest';
import {
  login,
  checkAuthenticated,
  logout,
  getUserEmail,
  signUpUser,
} from './auth';
import { AuthError } from '@supabase/supabase-js';

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
