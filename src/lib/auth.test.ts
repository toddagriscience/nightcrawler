/**
 * @jest-environment jsdom
 */

import { checkAuthenticated } from './auth';
import { login } from './actions/auth';
import { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

jest.mock('./logger', () => ({
  warn: jest.fn(),
}));

const mockSignInWithPassword = jest.fn();
const mockGetUser = jest.fn();

jest.mock('./supabase/server', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getUser: mockGetUser,
    },
  }),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data and no error on successful login', async () => {
    const fakeData = { session: 'abc' };
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password');

    mockSignInWithPassword.mockResolvedValue({
      data: fakeData,
      error: null,
    });

    await expect(login(null, formData)).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('returns the error when Supabase returns one', async () => {
    const fakeError = new AuthError('Invalid credentials');
    const formData = new FormData();
    formData.append('email', 'bad@example.com');
    formData.append('password', 'wrong');

    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: fakeError,
    });

    const result = await login(null, formData);

    expect(result.error).toBe(fakeError);
  });

  it('returns default error when an exception is thrown', async () => {
    const formData = new FormData();
    formData.append('email', 'x');
    formData.append('password', 'y');

    mockSignInWithPassword.mockRejectedValue(new Error('network'));

    const result = await login(null, formData);

    expect(result.error).toBe('network');
  });
});

describe('checkAuthenticated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
