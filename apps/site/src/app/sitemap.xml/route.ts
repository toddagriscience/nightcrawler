// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getCanonicalUrl } from '@/lib/canonical-urls';

/** XML index for the two generated sitemap files. */
export function GET(): Response {
  const entries = ['main', 'careers']
    .map(
      (id) =>
        `<sitemap><loc>${getCanonicalUrl(`/sitemap/${id}.xml`).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</loc></sitemap>`
    )
    .join('');
  return new Response(
    // eslint-disable-next-line no-secrets/no-secrets -- XML declaration is a public format header.
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    }
  );
}
