/**
 * @jest-environment jsdom
 */

import { login, checkAuthenticated } from './auth';
import { AuthError } from '@supabase/supabase-js';

jest.mock('./logger', () => ({
  warn: jest.fn(),
}));

const mockSignInWithPassword = jest.fn();
const mockGetUser = jest.fn();

jest.mock('./supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getUser: mockGetUser,
    },
  }),
}));

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    expect(result.error).toBeInstanceOf(AuthError);
    expect((result.error! as AuthError).message).toContain(
      'Something went wrong'
    );
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
