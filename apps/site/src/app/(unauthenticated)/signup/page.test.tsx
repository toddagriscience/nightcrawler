// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import Signup from '@/app/(unauthenticated)/signup/page';
import { redirect } from 'next/navigation';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error('Redirect: ' + url);
  }),
}));

describe('legacy approved-applicant signup URL', () => {
  beforeEach(() => vi.clearAllMocks());

  it('preserves the approval link in the unified onboarding URL', async () => {
    await expect(
      Signup({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'approval-token',
        }),
      })
    ).rejects.toThrow(
      'Redirect: /apply?application_id=42&token=approval-token'
    );
    expect(redirect).toHaveBeenCalledWith(
      '/apply?application_id=42&token=approval-token'
    );
  });

  it('sends missing links to contact instead of an unvalidated password form', async () => {
    await expect(
      Signup({ searchParams: Promise.resolve({ application_id: '42' }) })
    ).rejects.toThrow('Redirect: /contact');
  });

  it('rejects repeated query parameters rather than selecting an ambiguous token', async () => {
    await expect(
      Signup({
        searchParams: Promise.resolve({
          application_id: '42',
          token: ['one', 'two'],
        }),
      })
    ).rejects.toThrow('Redirect: /contact');
  });
});
