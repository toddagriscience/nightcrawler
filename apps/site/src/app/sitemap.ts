// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import {
  getCareersSitemapArticles,
  getMainSitemapArticles,
} from '@/lib/sanity/articles';
import type { SanityArticle } from '@/lib/sanity/article-types';
import type { MetadataRoute } from 'next';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';

const baseUrl = env.baseUrl;

/** Child sitemap identifiers: main site URLs vs career CMS articles (`/index/[slug]` only). */
export async function generateSitemaps(): Promise<Array<{ id: string }>> {
  return [{ id: 'main' }, { id: 'careers' }];
}

// Revalidate sitemap every 24 hours (86400 seconds)
export const revalidate = 86400;

/**
 * Generates split sitemaps: `main` (static pages + non-career articles) and `careers` (career articles only).
 *
 * @param props - Resolved sitemap slice id from {@link generateSitemaps}
 * @returns URL entries for this sitemap file
 */
export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const slice = await id;
  if (slice === 'careers') {
    return await getSanityCareersArticleIndexSitemap();
  }
  return getStaticSitemap().concat(await getSanityArticleMainIndexSitemap());
}

/**
 * Generates sitemap entries for static pages (homepage, about, etc.)
 * Includes internationalization support and proper SEO priorities
 * @returns {MetadataRoute.Sitemap} Sitemap entries for static pages
 */
function getStaticSitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  const staticPages = [
    '/',
    '/careers',
    '/who-we-are',
    '/news',
    '/terms',
    '/privacy',
    '/contact',
    '/accessibility',
    '/investors',
    '/investors/esg',
    '/investors/governance/vincent-todd',
    '/investors/governance/lawrence-wilson',
    '/investors/governance/brandy-beem',
    '/testing',
  ];
  const excludedPages = ['/login', '/admin', '/api', '/_next', '/cdn-cgi'];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      // Skip excluded pages
      if (excludedPages.includes(page)) {
        continue;
      }

      const url = `${baseUrl}/${locale}${page}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: getSupportedLanguages(page),
        },
      });
    }
  }

  return sitemapEntries;
}

/**
 * Converts internal article documents to `/index/[slug]` sitemap rows per locale.
 *
 * @param articles - Sanity articles (already filtered for sitemap eligibility)
 * @returns Sitemap rows
 */
function articleListToIndexSitemapEntries(
  articles: SanityArticle[]
): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const article of articles) {
      const slug = article.slug?.current;

      if (slug === undefined || slug === null || slug.length === 0) {
        continue;
      }

      const lastModified =
        article._updatedAt !== undefined ? article._updatedAt : new Date();
      const url = `${baseUrl}/${locale}/index/${slug}`;

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: getSupportedLanguages(`/index/${slug}`),
        },
      });
    }
  }
  return sitemapEntries;
}

/** Non-career Sanity article URLs for the main sitemap slice. */
async function getSanityArticleMainIndexSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = await getMainSitemapArticles({
      next: { revalidate: 86400 },
    });
    return articleListToIndexSitemapEntries(articles);
  } catch (error) {
    logger.error('Error generating main Sanity article sitemap:', error);
    return [];
  }
}

/** Career-tagged Sanity article URLs for the dedicated careers sitemap file. */
async function getSanityCareersArticleIndexSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = await getCareersSitemapArticles({
      next: { revalidate: 86400 },
    });
    return articleListToIndexSitemapEntries(articles);
  } catch (error) {
    logger.error('Error generating careers Sanity article sitemap:', error);
    return [];
  }
}

/**
 * Generates hreflang alternate URLs for all supported locales
 * Includes x-default for better international SEO
 * @param {string} page - The page path (with or without leading slash)
 * @returns {Languages<string>} Object mapping locales to URLs
 */
function getSupportedLanguages(page: string): Languages<string> {
  const languages: { [key: string]: string } = {};
  routing.locales.forEach((loc) => {
    // Ensure proper path separator - page might already start with '/' or be empty
    const cleanPage = page.startsWith('/') ? page : `/${page}`;
    languages[loc] = `${baseUrl}/${loc}${cleanPage}`;
  });

  // Add x-default for better international SEO
  languages['x-default'] =
    `${baseUrl}/${routing.defaultLocale}${page.startsWith('/') ? page : `/${page}`}`;

  return languages;
}
