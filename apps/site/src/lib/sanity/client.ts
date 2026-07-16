// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createClient, type FilteredResponseQueryOptions } from 'next-sanity';

export const client = createClient({
  projectId: '3x7sixjh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  // The Sanity CDN serves cached responses that Next.js cannot invalidate,
  // stacking a second staleness window on top of the ISR window below.
  // Editors expect published changes to appear within minutes, so we read
  // from the API directly and let `SANITY_REVALIDATE` govern freshness.
  useCdn: false,
});

/** ISR window, in seconds, for every Sanity read. Bounds how stale published content can be. */
export const SANITY_REVALIDATE = 5 * 60;

/** Fetch options applied to Sanity reads that do not opt into their own caching. */
export const defaultSanityFetchOptions: FilteredResponseQueryOptions = {
  next: { revalidate: SANITY_REVALIDATE },
};
