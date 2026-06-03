// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import specialRedirect from './special-redirect';

vi.mock('@/i18n/config', () => ({
  SUPPORTED_LOCALES: ['en', 'es'],
}));

function makeRequest(pathname: string): NextRequest {
  return {
    url: `https://example.com${pathname}`,
    nextUrl: { pathname },
  } as unknown as NextRequest;
}

describe('specialRedirect', () => {
  it('redirects /iris to /index/introducing-iris', () => {
    const response = specialRedirect(makeRequest('/iris'));
    expect(response).not.toBeNull();
    expect(response?.headers.get('location')).toBe(
      'https://example.com/index/introducing-iris'
    );
  });

  it('redirects locale externship route to Google form', () => {
    const response = specialRedirect(makeRequest('/en/careers/externship'));
    expect(response).not.toBeNull();
    expect(response?.headers.get('location')).toContain(
      'docs.google.com/forms'
    );
  });

  it('returns null for non-special routes', () => {
    const response = specialRedirect(makeRequest('/about'));
    expect(response).toBeNull();
  });
});
