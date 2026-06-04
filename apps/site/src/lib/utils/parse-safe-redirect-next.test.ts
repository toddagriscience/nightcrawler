// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { parseSafeRedirectNext } from './parse-safe-redirect-next';

describe('parseSafeRedirectNext', () => {
  const origin = 'https://toddagriscience.com';

  it('splits pathname and query for incoming onboarding paths', () => {
    const params = new URLSearchParams({
      first_name: 'Jane',
      application_id: '1',
      token: 'abc',
    });
    const next = `/incoming?${params.toString()}`;
    const result = parseSafeRedirectNext(next, origin);

    expect(result.pathname).toBe('/incoming');
    expect(result.search).toBe(`?${params.toString()}`);
  });

  it('returns empty search for path-only redirects', () => {
    const result = parseSafeRedirectNext('/apply', origin);

    expect(result.pathname).toBe('/apply');
    expect(result.search).toBe('');
  });

  it('preserves encoded query values', () => {
    const params = new URLSearchParams({ email: 'jane@farm.com' });
    const next = `/incoming?${params.toString()}`;
    const result = parseSafeRedirectNext(next, origin);

    expect(result.pathname).toBe('/incoming');
    expect(result.search).toBe('?email=jane%40farm.com');
  });
});
