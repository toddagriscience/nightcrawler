// Copyright © Todd Agriscience, Inc. All rights reserved.

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { client } from '../src/lib/sanity/client';
import type { SanityArticle } from '../src/lib/sanity/article-types';

const baseUrl = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const canonicalBase = (process.argv[3] ?? baseUrl).replace(/\/$/, '');
const publications = await client.fetch<SanityArticle[]>(
  '*[_type == "news" && !(_id in path("drafts.**")) && coalesce(language, "en") in ["en", "es"] && (!defined(offSiteUrl) || offSiteUrl == "")]{title,slug,date,author,editorialOwner,"language":coalesce(language,"en")}'
);
assert.ok(publications.length > 0, 'No published on-site articles found');
let checked = 0;
for (const userAgent of [
  'Mozilla/5.0',
  'Googlebot/2.1',
  'bingbot/2.0',
  'OAI-SearchBot/1.0',
]) {
  for (const article of publications) {
    const path = `${article.language === 'es' ? '/es' : ''}/index/${article.slug.current}`;
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { 'user-agent': userAgent },
      redirect: 'manual',
    });
    assert.equal(response.status, 200, `${userAgent} ${path}`);
    const dom = new JSDOM(await response.text());
    const document = dom.window.document;
    const semanticArticle = document.querySelector('main > article');
    assert.ok(semanticArticle, `${path}: semantic article missing`);
    assert.equal(
      semanticArticle.querySelectorAll('h1').length,
      1,
      `${path}: duplicate H1`
    );
    assert.equal(
      semanticArticle.querySelector('h1')?.textContent,
      article.title
    );
    assert.equal(document.querySelectorAll('[data-article-body]').length, 1);
    const summary = semanticArticle.querySelector(
      '[data-article-summary]'
    )?.textContent;
    assert.ok(
      summary && summary.length > article.title.length,
      `${path}: useful summary missing`
    );
    assert.equal(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
      summary
    );
    assert.equal(
      document.head
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content'),
      summary
    );
    assert.equal(
      document.head
        .querySelector('meta[property="og:type"]')
        ?.getAttribute('content'),
      'article'
    );
    const canonical = `${canonicalBase}${path}`;
    assert.equal(
      document.head
        .querySelector('link[rel="canonical"]')
        ?.getAttribute('href'),
      canonical
    );
    const schemaNodes = semanticArticle.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    assert.equal(schemaNodes.length, 1);
    const schema = JSON.parse(schemaNodes[0].textContent ?? '{}') as {
      headline: string;
      description: string;
      datePublished?: string;
      author: { name: string };
      image: string[];
      url: string;
      mainEntityOfPage: { '@id': string };
      inLanguage: string;
    };
    assert.equal(schema.headline, article.title);
    assert.equal(schema.description, summary);
    assert.equal(schema.datePublished, article.date);
    assert.ok(
      schema.datePublished && !Number.isNaN(Date.parse(schema.datePublished)),
      `${path}: real publication date missing`
    );
    assert.equal(
      semanticArticle.querySelector('time')?.getAttribute('datetime'),
      article.date
    );
    assert.ok(
      semanticArticle.textContent?.includes(schema.author.name),
      `${path}: ownership not visible`
    );
    assert.equal(schema.url, canonical);
    assert.equal(schema.mainEntityOfPage['@id'], canonical);
    assert.equal(schema.inLanguage, article.language);
    const image = document.head
      .querySelector('meta[property="og:image"]')
      ?.getAttribute('content');
    assert.equal(schema.image[0], image);
    assert.equal(
      document.head
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute('content'),
      image
    );
    assert.ok(image);
    if (userAgent === 'Mozilla/5.0') {
      const imageResponse = await fetch(
        image.startsWith(canonicalBase)
          ? `${baseUrl}${image.slice(canonicalBase.length)}`
          : image
      );
      assert.equal(
        imageResponse.status,
        200,
        `${path}: sharing image unavailable`
      );
      assert.ok(
        imageResponse.headers.get('content-type')?.startsWith('image/')
      );
      if (image.includes('/api/articles/')) {
        const bytes = Buffer.from(await imageResponse.arrayBuffer());
        assert.equal(bytes.readUInt32BE(16), 1200);
        assert.equal(bytes.readUInt32BE(20), 630);
      }
    }
    dom.window.close();
    checked++;
  }
}
console.log(
  `Verified ${checked} raw article responses across browsers and search crawlers.`
);
