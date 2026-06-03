// Copyright © Todd Agriscience, Inc. All rights reserved.

/* eslint-disable no-secrets/no-secrets -- test fixtures use realistic query strings */

import { describe, expect, it } from 'vitest';
import { parseSafeRedirectNext } from './parse-safe-redirect-next';

describe('parseSafeRedirectNext', () => {
  const origin = 'https://toddagriscience.com';

  it('splits pathname and query for incoming onboarding paths', () => {
    const result = parseSafeRedirectNext(
      '/incoming?first_name=Jane&application_id=1&token=abc',
      origin
    );

    expect(result.pathname).toBe('/incoming');
    expect(result.search).toBe('?first_name=Jane&application_id=1&token=abc');
  });

  it('returns empty search for path-only redirects', () => {
    const result = parseSafeRedirectNext('/apply', origin);

    expect(result.pathname).toBe('/apply');
    expect(result.search).toBe('');
  });

  it('preserves encoded query values', () => {
    const result = parseSafeRedirectNext(
      '/incoming?email=jane%40farm.com',
      origin
    );

    expect(result.pathname).toBe('/incoming');
    expect(result.search).toBe('?email=jane%40farm.com');
  });
});
