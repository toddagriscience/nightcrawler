// src/lib/actions/auth.test.ts
import { login, sendResetPasswordEmail, updateUser } from '@/lib/actions/auth';
import { AuthResponseTypes } from '@/lib/types/auth';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest';

vitest.mock(import('../logger'), async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    warn: vitest.fn(),
  };
});

// Mock Supabase client
const mockSignInWithPassword = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
    },
  })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('auth.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
    mockUpdateUser.mockResolvedValue({ error: null });
  });

  // login()
  describe('login', () => {
    it('returns error for invalid credentials', async () => {
      const formData = new FormData();
      formData.set('email', 'invalid-email');
      formData.set('password', '');

      const result = await login({}, formData);

      expect(result.responseType).toBe(AuthResponseTypes.Login);
      expect(result.error).toBeDefined();
    });

    it('handles Supabase auth error', async () => {
      mockSignInWithPassword.mockResolvedValue({
        error: new Error('Supabase error'),
      });

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password');

      const result = await login({}, formData);

      expect(result.error).toBe('Supabase error');
    });

    it('calls redirect on successful login', async () => {
      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password');

      await login({}, formData);

      expect(redirect).toHaveBeenCalledWith('/');
    });
  });

  // sendResetPasswordEmail()
  describe('sendResetPasswordEmail', () => {
    it('returns error for invalid email', async () => {
      const formData = new FormData();
      formData.set('email', 'bad-email');

      const result = await sendResetPasswordEmail({}, formData);

      expect(result.responseType).toBe(AuthResponseTypes.SendResetPasswordEmail);
      expect(result.error).toBeDefined();
    });

    it('handles Supabase reset error', async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        error: 'Some reset error',
      });

      const formData = new FormData();
      formData.set('email', 'user@example.com');

      const result = await sendResetPasswordEmail({}, formData);

      expect(result.error).toBe('Some reset error');
    });

    it('succeeds on valid email', async () => {
      const formData = new FormData();
      formData.set('email', 'user@example.com');

      const result = await sendResetPasswordEmail({}, formData);

      expect(result.error).toBeNull();
    });
  });

  // -------------------------------------------------
  // updateUser()
  // -------------------------------------------------
  describe('updateUser', () => {
    it('returns error if passwords do not match', async () => {
      const formData = new FormData();
      formData.set('newPassword', 'pass1');
      formData.set('confirmNewPassword', 'pass2');

      const result = await updateUser({}, formData);

      expect(result.error).toBe("Passwords don't match");
    });

    it('handles Supabase update error', async () => {
      mockUpdateUser.mockResolvedValue({ error: 'Update failed' });

      const formData = new FormData();
      formData.set('newPassword', 'secret');
      formData.set('confirmNewPassword', 'secret');

      const result = await updateUser({}, formData);

      expect(result.error).toBe('Update failed');
    });

    it('updates user successfully', async () => {
      const formData = new FormData();
      formData.set('newPassword', 'secret');
      formData.set('confirmNewPassword', 'secret');

      const result = await updateUser({}, formData);

      expect(result.error).toBeNull();
      expect(result.responseType).toBe(AuthResponseTypes.UpdateUser);
    });
  });
});
