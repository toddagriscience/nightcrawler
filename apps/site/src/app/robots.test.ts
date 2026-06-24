// Copyright © Todd Agriscience, Inc. All rights reserved.

// @vitest-environment node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

const robotsPath = join(process.cwd(), 'public', 'robots.txt');
const robots = readFileSync(robotsPath, 'utf8');

describe('robots.txt', () => {
  it('does not enumerate internal/admin routes', () => {
    const internalRoutes = [
      '/admin/',
      '/api/',
      '/login/',
      '/signup/',
      '/invite',
      '/creator',
      '/partner',
      '/cdn-cgi/',
      '/_next/',
      '/apple-app-site-association',
      'careers/externship',
    ];

    for (const route of internalRoutes) {
      expect(robots).not.toContain(route);
    }
  });

  it('keeps the RSC data-route crawl-hygiene disallow', () => {
    // Not an internal/admin path — a query-param rule (like the ?ls= ones) that
    // keeps crawlers off Next.js RSC payloads. Out of scope for #938 removal.
    expect(robots).toContain('Disallow: /en-us*data=route*');
  });

  it('keeps bad-bot full-site blocks intact', () => {
    const badBots = ['AhrefsBot', 'CCBot', 'ByteSpider', 'Baiduspider'];

    for (const bot of badBots) {
      expect(robots).toContain(bot);
    }

    expect(robots).toContain('Disallow: /');
  });

  it('retains the anti-scrape query-param disallows', () => {
    expect(robots).toContain('ls=');
  });

  it('retains both sitemap locations', () => {
    expect(robots).toContain('sitemap/main.xml');
    expect(robots).toContain('sitemap/careers.xml');
  });

  it('remains crawlable for the default user-agent', () => {
    expect(robots).toContain('Allow: /');
  });
});
