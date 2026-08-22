// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  client,
  defaultSanityFetchOptions,
  SANITY_REVALIDATE,
} from '@/lib/sanity/client';
import { describe, expect, it } from 'vitest';

describe('sanity client', () => {
  it('reads from the API rather than the CDN so Next.js controls staleness', () => {
    expect(client.config().useCdn).toBe(false);
  });
});

describe('SANITY_REVALIDATE', () => {
  it('keeps published content at most five minutes stale', () => {
    expect(SANITY_REVALIDATE).toBeLessThanOrEqual(5 * 60);
  });

  it('backs the default fetch options', () => {
    expect(defaultSanityFetchOptions).toEqual({
      next: { revalidate: SANITY_REVALIDATE },
    });
  });
});
