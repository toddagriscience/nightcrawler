// Copyright © Todd Agriscience, Inc. All rights reserved.

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const baseUrl = (process.argv[2] ?? 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
const headers = { 'accept-language': 'es', cookie: 'NEXT_LOCALE=es' };
const missingPaths = [
  '/unknown-public-page',
  '/es/unknown-public-page',
  '/index/missing-verification-document',
  '/es/index/missing-verification-document',
  '/index/missing.verification.document',
  '/about/missing-verification-document',
  '/es/about/missing-verification-document',
  '/forms/missing-verification-document',
  '/es/forms/missing-verification-document',
];

// Run against `next start`, since a development response can hide a successful
// prerendered shell that incorrectly turns a missing resource into HTTP 200.
for (const path of missingPaths) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    redirect: 'manual',
  });
  assert.equal(response.status, 404, `${path} must return HTTP 404`);
  const page = new JSDOM(await response.text());
  assert.match(
    page.window.document
      .querySelector('meta[name="robots"]')
      ?.getAttribute('content') ?? '',
    /noindex/,
    `${path} must prevent indexing`
  );
  page.window.close();
}

for (const [path, locale] of [
  ['/about', 'en'],
  ['/es/about', 'es'],
]) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    redirect: 'manual',
  });
  assert.equal(response.status, 200, `${path} must be a final URL`);
  const page = new JSDOM(await response.text());
  const document = page.window.document;
  assert.equal(document.documentElement.lang, locale);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(
    document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    `${baseUrl}${path}`
  );
  page.window.close();
}

const alias = await fetch(`${baseUrl}/en/about?source=verification`, {
  redirect: 'manual',
  headers,
});
assert.equal(alias.status, 308);
assert.equal(
  new URL(alias.headers.get('location') ?? '', baseUrl).href,
  `${baseUrl}/about?source=verification`
);

for (const path of [
  '/sitemap.xml',
  '/sitemap/main.xml',
  '/sitemap/careers.xml',
]) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /^application\/xml/);
  if (path === '/sitemap/careers.xml')
    assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  const xml = new JSDOM(await response.text(), {
    contentType: 'application/xml',
  });
  assert.equal(xml.window.document.querySelector('parsererror'), null);
  // The careers URL set can legitimately be empty when every role has closed.
  if (path !== '/sitemap/careers.xml')
    assert.equal(xml.window.document.querySelectorAll('loc').length > 0, true);
  for (const url of xml.window.document.querySelectorAll('loc')) {
    assert.doesNotMatch(url.textContent ?? '', /\/en\//);
  }
  xml.window.close();
}

console.log('Verified final locale URLs, HTTP 404 responses and XML sitemaps.');
