// Copyright © Todd Agriscience, Inc. All rights reserved.

// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { handleI18nMiddleware } from './i18n';

describe('real next-intl routing with final English canonicals', () => {
  it.each(['/about', '/index/introducing-iris', '/'])(
    'serves English URL %s even with a Spanish preference',
    (path) => {
      const request = new NextRequest(`https://toddagriscience.com${path}`, {
        headers: { 'accept-language': 'es', cookie: 'NEXT_LOCALE=es' },
      });
      const response = handleI18nMiddleware(request, false);
      expect(response.status).toBe(200);
      expect(response.headers.has('location')).toBe(false);
      expect(
        response.headers.get('x-middleware-request-x-next-intl-locale')
      ).toBe('en');
    }
  );
  it('permanently redirects the legacy /en prefix directly to the final English URL', () => {
    const response = handleI18nMiddleware(
      new NextRequest('https://toddagriscience.com/en/about?campaign=x'),
      false
    );
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      'https://toddagriscience.com/about?campaign=x'
    );
    expect(response.cookies.get('NEXT_LOCALE')?.value).toBe('en');
  });
  it('preserves a deliberate Spanish route and forwards the Spanish request locale', () => {
    const response = handleI18nMiddleware(
      new NextRequest('https://toddagriscience.com/es/about'),
      false
    );
    expect(response.status).toBe(200);
    expect(response.headers.has('location')).toBe(false);
    expect(
      response.headers.get('x-middleware-request-x-next-intl-locale')
    ).toBe('es');
  });
  it('leaves unlocalized auth routes outside next-intl routing', () => {
    const response = handleI18nMiddleware(
      new NextRequest('https://toddagriscience.com/auth/confirm'),
      false
    );
    expect(response.headers.has('x-middleware-rewrite')).toBe(false);
  });
});
