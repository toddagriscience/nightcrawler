// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getCanonicalUrl, getPageAlternates } from '@/lib/canonical-urls';
import { routing } from '@/i18n/config';
import { logger } from '@/lib/logger';
import { getArticleAlternates } from '@/lib/sanity/article-locales';
import {
  ARTICLE_INDEX_TOPIC_TYPES,
  type SanityArticle,
} from '@/lib/sanity/article-types';
import {
  getCareersSitemapArticles,
  getMainSitemapArticles,
} from '@/lib/sanity/articles';
import { SANITY_REVALIDATE } from '@/lib/sanity/client';
import { isActiveJob } from '@/lib/sanity/job-posting';
import { unstable_cache } from 'next/cache';
import type { MetadataRoute } from 'next';

/** Child sitemap identifiers, linked from the XML index at `/sitemap.xml`. */
export async function generateSitemaps(): Promise<Array<{ id: string }>> {
  return [{ id: 'main' }, { id: 'careers' }];
}

/** Final canonical URLs for static translations and separately published CMS documents. */
export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const slice = await id;
  return slice === 'careers'
    ? await getArticleSitemap('careers')
    : [...getStaticSitemap(), ...(await getArticleSitemap('main'))];
}

function getStaticSitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/',
    '/careers',
    '/careers/search',
    '/about',
    '/research',
    '/research/index',
    '/news',
    '/terms',
    '/privacy',
    '/contact',
    '/accessibility',
    '/investors',
    '/investors/esg',
    '/brand',
    '/legal',
    ...ARTICLE_INDEX_TOPIC_TYPES.map((topic) => `/research/index/${topic}`),
  ];
  return routing.locales.flatMap((locale) =>
    pages.map((path) => ({
      url: getCanonicalUrl(path, locale),
      changeFrequency:
        path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : 0.8,
      alternates: { languages: getPageAlternates(path, locale).languages },
    }))
  );
}

async function getArticleSitemap(
  slice: 'main' | 'careers'
): Promise<MetadataRoute.Sitemap> {
  try {
    const articles =
      slice === 'careers'
        ? await getCareersSitemapArticles({ cache: 'no-store' })
        : await getCachedMainSitemapArticles();
    return articles
      .filter((article) => article._type !== 'career' || isActiveJob(article))
      .map((article: SanityArticle) => {
        const alternates = getArticleAlternates({
          ...article,
          publishedTranslations: article.publishedTranslations?.filter(
            (variant) => variant.excludeFromSitemap !== true
          ),
        });
        return {
          url: alternates.canonical,
          ...(article._updatedAt ? { lastModified: article._updatedAt } : {}),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: { languages: alternates.languages },
        };
      });
  } catch (error) {
    logger.error('Error generating published article sitemap:', error);
    return [];
  }
}

// Cache stable news data. Career closure/expiry stays outside this boundary.
const getCachedMainSitemapArticles = unstable_cache(
  async () => getMainSitemapArticles(),
  ['published-main-sitemap-articles'],
  { revalidate: SANITY_REVALIDATE }
);
