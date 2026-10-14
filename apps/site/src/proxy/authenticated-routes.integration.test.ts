// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import proxy from '@/proxy';

const { authState } = vi.hoisted(() => ({
  authState: { authenticated: true },
}));

// Keep the real auth handler and proxy. Only the external identity service is
// replaced with disposable claims, so the protected-route response contract is
// tested before next-intl or the public 404 gate can run.
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getClaims: vi.fn(async () => ({
        data: {
          claims: authState.authenticated ? { sub: 'fixture-user' } : null,
        },
      })),
    },
  })),
}));

beforeEach(() => {
  authState.authenticated = true;
});

describe('authenticated routes stay outside the public existence gate', () => {
  it.each([
    '/',
    '/account',
    '/account/settings',
    '/reminders',
    '/support-tools',
    '/apply',
  ])('allows an authenticated request through on %s', async (path) => {
    const response = await proxy(
      new NextRequest(`https://toddagriscience.com${path}`)
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.has('x-middleware-rewrite')).toBe(false);
  });

  it('preserves the unauthenticated account redirect', async () => {
    authState.authenticated = false;
    const response = await proxy(
      new NextRequest('https://toddagriscience.com/account')
    );
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://toddagriscience.com/'
    );
  });

  it('keeps approval-token onboarding behind page-level validation', async () => {
    authState.authenticated = false;
    const requestUrl = new URL('https://toddagriscience.com/apply');
    requestUrl.searchParams.set('application_id', '42');
    requestUrl.searchParams.set('token', 'fixture-token');
    const response = await proxy(new NextRequest(requestUrl));
    expect(response.status).toBe(200);
    expect(response.headers.has('x-middleware-rewrite')).toBe(false);
  });
});
