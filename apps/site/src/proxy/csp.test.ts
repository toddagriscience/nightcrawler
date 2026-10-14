// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { buildNonceCsp, withNonceCsp } from './csp';

afterEach(() => vi.unstubAllEnvs());

describe('nonce policy', () => {
  it('requires a script nonce in production while preserving Stripe frames/styles and safe resource policies', () => {
    const policy = buildNonceCsp('generatedNonce', false);
    const script = policy
      .split(';')
      .find((directive) => directive.trim().startsWith('script-src'));
    expect(script).toBe(" script-src 'nonce-generatedNonce' 'strict-dynamic'");
    expect(script).not.toContain('unsafe-inline');
    expect(script).not.toContain('unsafe-eval');
    expect(policy).toContain(
      "frame-src 'self' https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com https://checkout.stripe.com"
    );
    expect(policy).not.toContain("frame-src 'none'");
    expect(policy).toContain(
      'https://api.stripe.com https://r.stripe.com https://checkout.stripe.com'
    );
    expect(policy).toContain('https://cdn.sanity.io https://*.stripe.com');
    expect(policy).toContain("style-src-attr 'unsafe-inline'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain('upgrade-insecure-requests');
  });
  it('allows development debugging without adding unsafe-eval or HTTP upgrades to production', () => {
    expect(buildNonceCsp('nonce', true)).toContain("'unsafe-eval'");
    expect(buildNonceCsp('nonce', true)).not.toContain(
      'upgrade-insecure-requests'
    );
    expect(buildNonceCsp('nonce', false)).not.toContain("'unsafe-eval'");
  });
  it('retains an explicitly configured external seed image origin', () => {
    vi.stubEnv(
      'NEXT_PUBLIC_SEED_IMAGE_BASE_URL',
      'https://images.example.test/seeds/'
    );
    expect(buildNonceCsp('nonce', false)).toContain(
      'https://images.example.test'
    );
    expect(buildNonceCsp('nonce', false)).not.toContain(
      'https://images.example.test/seeds/'
    );
  });
});

describe('withNonceCsp', () => {
  it('overrides forged nonce/CSP headers and gives the renderer and response exactly the same nonce policy', async () => {
    const original = new NextRequest('http://localhost/privacy', {
      headers: {
        'x-nonce': 'forged',
        'Content-Security-Policy': "script-src 'unsafe-inline'",
        cookie: 'preferences=1',
      },
    });
    let renderingPolicy: string | null = null;
    let renderingNonce: string | null = null;
    const response = await withNonceCsp(original, async (request) => {
      renderingPolicy = request.headers.get('content-security-policy');
      renderingNonce = request.headers.get('x-nonce');
      expect(request.cookies.get('preferences')?.value).toBe('1');
      return NextResponse.next();
    });
    expect(renderingNonce).toMatch(/^[A-Za-z0-9+/]{32}$/);
    expect(renderingNonce).not.toBe('forged');
    expect(response.headers.get('Content-Security-Policy')).toBe(
      renderingPolicy
    );
    expect(response.headers.get('x-middleware-request-x-nonce')).toBe(
      renderingNonce
    );
    expect(
      response.headers.get('x-middleware-request-content-security-policy')
    ).toBe(renderingPolicy);
    expect(response.headers.get('x-middleware-override-headers')).toContain(
      'x-nonce'
    );
    expect(response.headers.has('Content-Security-Policy-Report-Only')).toBe(
      false
    );
  });

  it('generates an independent unpredictable nonce for every request', async () => {
    const nonces = new Set<string | null>();
    for (let index = 0; index < 20; index += 1) {
      const response = await withNonceCsp(
        new NextRequest('http://localhost/'),
        async () => NextResponse.next()
      );
      nonces.add(response.headers.get('x-middleware-request-x-nonce'));
    }
    expect(nonces.size).toBe(20);
  });

  it('preserves locale rewrites, trusted locale overrides and privacy cookies', async () => {
    const response = await withNonceCsp(
      new NextRequest('http://localhost/es/privacy'),
      async (request) => {
        const forwarded = new Headers(request.headers);
        forwarded.set('x-next-intl-locale', 'es');
        const response = NextResponse.rewrite(
          new URL('/es/privacy', request.url),
          { request: { headers: forwarded } }
        );
        response.cookies.set('privacy-preferences', 'fixture', {
          path: '/',
          sameSite: 'lax',
        });
        return response;
      }
    );
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'http://localhost/es/privacy'
    );
    expect(
      response.headers.get('x-middleware-request-x-next-intl-locale')
    ).toBe('es');
    expect(response.headers.get('x-middleware-override-headers')).toContain(
      'x-next-intl-locale'
    );
    expect(response.cookies.get('privacy-preferences')?.value).toBe('fixture');
  });

  it('preserves authentication redirects and response cookies', async () => {
    const response = await withNonceCsp(
      new NextRequest('http://localhost/account'),
      async () => {
        const response = NextResponse.redirect('http://localhost/login');
        response.cookies.set('session-refresh', 'fixture');
        return response;
      }
    );
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/login');
    expect(response.cookies.get('session-refresh')?.value).toBe('fixture');
    expect(response.headers.has('Content-Security-Policy')).toBe(true);
  });

  it('forwards refreshed authentication cookies to the renderer', async () => {
    const response = await withNonceCsp(
      new NextRequest('http://localhost/account', {
        headers: { cookie: 'session=expired; preferences=1' },
      }),
      async (request) => {
        request.cookies.set('session', 'refreshed');
        request.headers.set('x-authenticated-user', 'fixture');
        const response = NextResponse.next();
        response.cookies.set('session', 'refreshed');
        return response;
      }
    );
    expect(response.headers.get('x-middleware-request-cookie')).toContain(
      'session=refreshed'
    );
    expect(response.headers.get('x-middleware-request-cookie')).toContain(
      'preferences=1'
    );
    expect(
      response.headers.get('x-middleware-request-x-authenticated-user')
    ).toBe('fixture');
    expect(response.cookies.get('session')?.value).toBe('refreshed');
  });

  it('preserves server-action POST methods and bodies', async () => {
    const original = new NextRequest('http://localhost/forms/review', {
      method: 'POST',
      body: 'synthetic action body',
      headers: { 'Content-Type': 'text/plain' },
    });
    await withNonceCsp(original, async (request) => {
      expect(request.method).toBe('POST');
      expect(await request.text()).toBe('synthetic action body');
      return NextResponse.next();
    });
  });
});
