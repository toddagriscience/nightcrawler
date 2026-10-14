// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { config } from './proxy';

// Only route matching is under test; locale behavior has its own integration tests.
vi.mock('next-intl/middleware', () => ({ default: () => vi.fn() }));

describe('nonce proxy route coverage', () => {
  it.each([
    '/',
    '/es/privacy',
    '/account',
    '/forms/review.v2',
    '/es/index/soil.v2',
    '/apiary',
    '/creators',
    '/ten-rising-stars',
  ])('covers HTML routes including dotted CMS paths: %s', (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
  });

  it.each([
    '/sitemap.xml',
    '/sitemap/main.xml',
    '/sitemap/careers.xml',
    '/api/revalidate',
    '/api',
    '/_next/static/chunks/app.js',
    '/_next/image?url=/icon.png',
    '/fonts/roboto.woff2',
    '/images/soil.png',
    '/marketing/background.webp',
    '/go/article.webp',
    '/ten-rising-stars/j-mark.png',
    '/favicon.ico',
    '/robots.txt',
    '/wordmark.svg',
    '/seed-placeholder.svg',
    '/opengraph-image.png',
  ])('leaves API and public resources outside nonce processing: %s', (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
  });
});
