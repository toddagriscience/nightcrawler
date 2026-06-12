// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { resolveAuthConfirmRedirectTarget } from './resolve-auth-confirm-redirect';

vi.mock('@nightcrawler/db/queries', () => ({
  resolveSignupPathForSignupToken: vi.fn(),
}));

const { resolveSignupPathForSignupToken } =
  await import('@nightcrawler/db/queries');

describe('auth confirm redirect resolution', () => {
  it('redirects to signup when application_id and signup_token resolve', async () => {
    const signupParams = new URLSearchParams({
      application_id: '6',
      token: 'abc',
    });
    vi.mocked(resolveSignupPathForSignupToken).mockResolvedValue(
      `/signup?${signupParams.toString()}`
    );

    const result = await resolveAuthConfirmRedirectTarget({
      applicationIdParam: '6',
      signupTokenParam: 'abc',
      requestedNext: '/',
      origin: 'http://localhost:3000',
    });

    expect(result.pathname).toBe('/signup');
    expect(result.search).toContain('application_id=6');
  });

  it('falls back to next param when signup token does not resolve', async () => {
    vi.mocked(resolveSignupPathForSignupToken).mockResolvedValue(null);

    const result = await resolveAuthConfirmRedirectTarget({
      applicationIdParam: '6',
      signupTokenParam: 'stale',
      requestedNext: '/apply',
      origin: 'http://localhost:3000',
    });

    expect(result.pathname).toBe('/apply');
    expect(result.search).toBe('');
  });
});
