// Copyright © Todd Agriscience, Inc. All rights reserved.

/* eslint-disable no-secrets/no-secrets -- test fixtures use realistic onboarding URLs */

import { describe, expect, it, vi } from 'vitest';
import { resolveAuthConfirmRedirectTarget } from './resolve-auth-confirm-redirect';

vi.mock('@nightcrawler/db/queries', () => ({
  resolveIncomingPathForSignupToken: vi.fn(),
}));

const { resolveIncomingPathForSignupToken } =
  await import('@nightcrawler/db/queries');

describe('resolveAuthConfirmRedirectTarget', () => {
  it('redirects to incoming when application_id and signup_token resolve', async () => {
    vi.mocked(resolveIncomingPathForSignupToken).mockResolvedValue(
      '/incoming?email=test%40example.com&application_id=6&token=abc'
    );

    const result = await resolveAuthConfirmRedirectTarget({
      applicationIdParam: '6',
      signupTokenParam: 'abc',
      requestedNext: '/',
      origin: 'http://localhost:3000',
    });

    expect(result.pathname).toBe('/incoming');
    expect(result.search).toContain('application_id=6');
  });

  it('falls back to next param when signup token does not resolve', async () => {
    vi.mocked(resolveIncomingPathForSignupToken).mockResolvedValue(null);

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
