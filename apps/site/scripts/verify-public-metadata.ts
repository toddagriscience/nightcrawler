// Copyright © Todd Agriscience, Inc. All rights reserved.

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const baseUrl = (process.argv[2] ?? 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
const canonicalBase = (process.argv[3] ?? baseUrl).replace(/\/+$/, '');
const userAgents = {
  browser:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
  google:
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  bing: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  chatgptSearch: 'OAI-SearchBot/1.0; +https://openai.com/searchbot',
};
const pages = [
  '/',
  '/research',
  '/news',
  '/careers',
  '/about',
  '/contact',
  '/investors',
  '/investors/esg',
];
let checked = 0;

for (const [agent, userAgent] of Object.entries(userAgents)) {
  for (const locale of ['en', 'es']) {
    const descriptions = new Set<string>();
    for (const path of pages) {
      const localizedPath = `${locale === 'es' ? '/es' : ''}${locale === 'es' && path === '/' ? '' : path}`;
      const response = await fetch(`${baseUrl}${localizedPath}`, {
        redirect: 'manual',
        headers: { 'user-agent': userAgent },
      });
      const context = `${agent} ${localizedPath}`;
      assert.equal(response.status, 200, context);
      const html = await response.text();
      const rawHead = html.slice(0, html.indexOf('</head>'));
      assert.ok(rawHead.includes('<head>'), `${context}: head missing`);
      const dom = new JSDOM(`${rawHead}</head></html>`);
      const head = dom.window.document.head;
      const requireSingle = (selector: string): Element => {
        const nodes = head.querySelectorAll(selector);
        assert.equal(
          nodes.length,
          1,
          `${context}: expected one ${selector} before closing head`
        );
        return nodes[0];
      };
      const title = requireSingle('title').textContent ?? '';
      const description =
        requireSingle('meta[name="description"]').getAttribute('content') ?? '';
      assert.ok(
        title.length > 0 && description.length > 40,
        `${context}: missing search copy`
      );
      descriptions.add(description);
      assert.match(
        requireSingle('meta[name="robots"]').getAttribute('content') ?? '',
        /index, follow/
      );
      const expectedUrl = new URL(`${canonicalBase}${localizedPath}`).href;
      assert.equal(
        new URL(
          requireSingle('link[rel="canonical"]').getAttribute('href') ?? ''
        ).href,
        expectedUrl
      );
      const enUrl = new URL(`${canonicalBase}${path}`).href;
      const esUrl = new URL(`${canonicalBase}/es${path === '/' ? '' : path}`)
        .href;
      for (const [language, url] of Object.entries({
        en: enUrl,
        es: esUrl,
        'x-default': enUrl,
      })) {
        assert.equal(
          new URL(
            requireSingle(
              `link[rel="alternate"][hreflang="${language}"]`
            ).getAttribute('href') ?? ''
          ).href,
          url
        );
      }
      for (const [property, expected] of Object.entries({
        'og:title': title,
        'og:description': description,
        'og:type': 'website',
        'og:locale': locale === 'es' ? 'es_US' : 'en_US',
      })) {
        assert.equal(
          requireSingle(`meta[property="${property}"]`).getAttribute('content'),
          expected,
          context
        );
      }
      assert.equal(
        new URL(
          requireSingle('meta[property="og:url"]').getAttribute('content') ?? ''
        ).href,
        expectedUrl
      );
      for (const [name, expected] of Object.entries({
        'twitter:title': title,
        'twitter:description': description,
        'twitter:card': 'summary_large_image',
      })) {
        assert.equal(
          requireSingle(`meta[name="${name}"]`).getAttribute('content'),
          expected,
          context
        );
      }
      assert.match(
        requireSingle('meta[property="og:image"]').getAttribute('content') ??
          '',
        /^https?:\/\//
      );
      assert.match(
        requireSingle('meta[name="twitter:image"]').getAttribute('content') ??
          '',
        /^https?:\/\//
      );
      assert.equal(
        requireSingle('meta[property="og:image:width"]').getAttribute(
          'content'
        ),
        path === '/careers' ? '2796' : '2396'
      );
      assert.equal(
        requireSingle('meta[property="og:image:height"]').getAttribute(
          'content'
        ),
        path === '/careers' ? '1460' : '1258'
      );
      const schemas = Array.from(
        head.querySelectorAll('script[type="application/ld+json"]'),
        (script) => JSON.parse(script.textContent ?? '{}')
      );
      assert.ok(
        schemas.some((schema) => schema['@type'] === 'WebSite'),
        `${context}: WebSite schema missing from head`
      );
      assert.ok(
        schemas.some((schema) => schema['@type'] === 'Organization'),
        `${context}: Organization schema missing from head`
      );
      dom.window.close();
      checked++;
    }
    assert.equal(
      descriptions.size,
      pages.length,
      `${agent} ${locale}: generic descriptions reused`
    );
  }
  console.log(`Verified ${agent} metadata for both languages.`);
}
console.log(
  `Verified ${checked} crawler/browser HTML responses with complete metadata in the head.`
);
