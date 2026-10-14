// Copyright © Todd Agriscience, Inc. All rights reserved.

// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/env', () => ({
  env: { baseUrl: 'https://toddagriscience.com' },
}));

describe('XML sitemap index', () => {
  it('serves the sitemap index as XML and links both child files', async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/xml');
    const xml = await response.text();
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toContain(
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(xml).toContain(
      '<loc>https://toddagriscience.com/sitemap/main.xml</loc>'
    );
    expect(xml).toContain(
      '<loc>https://toddagriscience.com/sitemap/careers.xml</loc>'
    );
  });
});
