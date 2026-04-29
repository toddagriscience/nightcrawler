// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { getSitemapArticles } from '@/lib/sanity/articles';
import type { MetadataRoute } from 'next';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';

const baseUrl = env.baseUrl;

// Revalidate sitemap every 24 hours (86400 seconds)
export const revalidate = 86400;

/**
 * Generates the complete sitemap for the Todd Agriscience website
 * Combines static pages and dynamic news articles with proper internationalization
 * @returns {MetadataRoute.Sitemap} Complete sitemap entries with hreflang alternates
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = getStaticSitemap().concat(
    await getSanityArticleIndexSitemap()
  );

  return sitemapEntries;
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

/** Sanity-driven article URLs (`/index/[slug]`), excluding outbound links and explicit SEO exclusions via `excludeFromSitemap`.
 *
 * @returns {MetadataRoute.Sitemap} Sitemap rows for canonical article detail pages
 */
async function getSanityArticleIndexSitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    const articles = await getSitemapArticles({
      next: { revalidate: 86400 },
    });

    for (const locale of routing.locales) {
      for (const article of articles) {
        const slug = article.slug?.current;

        if (slug === undefined || slug === null || slug.length === 0) {
          continue;
        }

        const lastModified =
          article._updatedAt !== undefined ? article._updatedAt : new Date();
        /** toddagriscience.com/{locale}/index/{slug} */
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
  } catch (error) {
    logger.error('Error generating Sanity article sitemap:', error);
  }

  return sitemapEntries;
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
