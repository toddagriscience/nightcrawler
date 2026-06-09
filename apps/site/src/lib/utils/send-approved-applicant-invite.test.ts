// Copyright © Todd Agriscience, Inc. All rights reserved.

import { sendApprovedApplicantInvite } from '@nightcrawler/db/utils/send-approved-applicant-invite';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const signInWithOtp = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOtp,
    },
  })),
}));

describe('sendApprovedApplicantInvite', () => {
  const baseInput = {
    email: 'applicant@example.com',
    firstName: 'Alex',
    onboardingUrl:
      'https://app.example.com/en/signup?application_id=1&token=abc',
    projectId: 'test-project',
    secretKey: 'test-secret',
  };

  beforeEach(() => {
    signInWithOtp.mockReset();
  });

  it('sends a magic link with the direct onboarding URL', async () => {
    signInWithOtp.mockResolvedValue({ error: null });

    const result = await sendApprovedApplicantInvite(baseInput);

    expect(result).toEqual({ sent: true, method: 'onboarding-link' });
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'applicant@example.com',
      options: {
        emailRedirectTo: baseInput.onboardingUrl,
        shouldCreateUser: true,
        data: {
          first_name: 'Alex',
          name: 'Alex',
        },
      },
    });
  });

  it('retries without creating a user when the email already exists', async () => {
    signInWithOtp
      .mockResolvedValueOnce({
        error: { message: 'User already registered' },
      })
      .mockResolvedValueOnce({ error: null });

    const result = await sendApprovedApplicantInvite(baseInput);

    expect(result).toEqual({ sent: true, method: 'onboarding-link' });
    expect(signInWithOtp).toHaveBeenCalledTimes(2);
    expect(signInWithOtp.mock.calls[1]?.[0]?.options?.shouldCreateUser).toBe(
      false
    );
  });

  it('returns a helpful error when both OTP attempts fail for existing users', async () => {
    signInWithOtp
      .mockResolvedValueOnce({
        error: { message: 'User already registered' },
      })
      .mockResolvedValueOnce({
        error: { message: 'Rate limit exceeded' },
      });

    const result = await sendApprovedApplicantInvite(baseInput);

    expect(result.sent).toBe(false);
    expect(result.error).toContain('Rate limit exceeded');
    expect(result.error).toContain('/en/signup**');
  });
});
