// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { parseSafeRedirectNext } from './parse-safe-redirect-next';

describe('parseSafeRedirectNext', () => {
  const origin = 'https://toddagriscience.com';

  it('splits pathname and query for signup onboarding paths', () => {
    const params = new URLSearchParams({
      application_id: '1',
      token: 'abc',
    });
    const next = `/signup?${params.toString()}`;
    const result = parseSafeRedirectNext(next, origin);

    expect(result.pathname).toBe('/signup');
    expect(result.search).toBe(`?${params.toString()}`);
  });

  it('returns empty search for path-only redirects', () => {
    const result = parseSafeRedirectNext('/apply', origin);

    expect(result.pathname).toBe('/apply');
    expect(result.search).toBe('');
  });

  it('preserves encoded query values', () => {
    const params = new URLSearchParams({ token: 'abc-def' });
    const next = `/signup?${params.toString()}`;
    const result = parseSafeRedirectNext(next, origin);

    expect(result.pathname).toBe('/signup');
    expect(result.search).toBe('?token=abc-def');
  });
});
