// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client } from '@/lib/sanity/client';
import { logger } from '@/lib/logger';
import type { ArticleCollection } from '@/lib/sanity/article-types';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { FilteredResponseQueryOptions } from 'next-sanity';

const ARTICLE_DOCUMENT_TYPE = 'news';

/** One hour ISR for marketing article surfaces. */
const LISTING_REVALIDATE = 60 * 60;

/** Default groq fragments for reusable article payloads. */
const ARTICLE_PROJECTION = `{
  _id,
  _type,
  _updatedAt,
  title,
  subtitle,
  slug,
  date,
  author,
  company,
  content,
  summary,
  thumbnail,
  headerImage,
  offSiteUrl,
  isFeatured,
  source,
  subscripts,
  contentType,
  collections,
  canonicalParent,
  excludeFromSitemap
}`;

/** Query options reused for article fetch surfaces. */
const defaultListingOptions: FilteredResponseQueryOptions = {
  next: { revalidate: LISTING_REVALIDATE },
};

/**
 * Whether this article is intended to be read on-site (has no off-site URL).
 *
 * @param article - Sanity article document
 * @returns True when the article should use `/index/[slug]`
 */
export function isInternalArticle(
  article: Pick<SanityArticle, 'offSiteUrl'>
): boolean {
  const url = article.offSiteUrl;
  return url === undefined || url === null || String(url).trim() === '';
}

/**
 * Whether the article should appear in the dynamic XML sitemap.
 *
 * @param article - Sanity article document
 * @returns True when the URL may be indexed
 */
export function isSitemapArticle(article: SanityArticle): boolean {
  if (!isInternalArticle(article)) return false;
  return article.excludeFromSitemap !== true;
}

/**
 * Whether the article is categorized as career content for `/careers` listings and the careers sitemap slice.
 *
 * @param article - Article classification fields from Sanity
 * @returns True when `contentType` or `collections` includes `careers`
 */
export function isCareerArticle(
  article: Pick<SanityArticle, 'contentType' | 'collections'>
): boolean {
  if (article.contentType === 'careers') return true;
  const cols = article.collections;
  return Array.isArray(cols) && cols.includes('careers');
}

/**
 * Lowercase collection key used in GROQ filters.
 *
 * @param collection - Marketing collection key
 * @returns Normalized string
 */
function collectionParam(collection: ArticleCollection): string {
  return collection;
}

/**
 * Fetch a single article by slug.
 *
 * @param slug - Slug `current` value
 * @param options - Optional Sanity fetch options
 * @returns Article or null
 */
export async function getArticleBySlug(
  slug: string,
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle | null> {
  try {
    const query = `*[_type == "${ARTICLE_DOCUMENT_TYPE}" && slug.current == $slug][0] ${ARTICLE_PROJECTION}`;
    const article = await client.fetch<SanityArticle | null>(
      query,
      { slug },
      options
    );
    return article ?? null;
  } catch (error) {
    logger.error('Sanity getArticleBySlug failed', error);
    return null;
  }
}

/**
 * Articles that belong to a collection: primary `contentType` or optional `collections` membership.
 * Missing `contentType` in CMS is treated as `news`. Sorted by `date` descending.
 *
 * @param collection - e.g. `news`, `research`
 * @param options - Optional Sanity fetch options
 * @returns Article list
 */
export async function getArticlesByCollection(
  collection: ArticleCollection,
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  const c = collectionParam(collection);
  try {
    const query = `*[_type == "${ARTICLE_DOCUMENT_TYPE}" && (
        coalesce(contentType, "news") == $collection ||
        $collection in coalesce(collections, [])
      )] | order(date desc) ${ARTICLE_PROJECTION}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      { collection: c },
      options ?? defaultListingOptions
    );
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    logger.error('Sanity getArticlesByCollection failed', error);
    return [];
  }
}

/**
 * Featured articles optionally scoped to a collection (primary type or `collections` array).
 *
 * @param collection - When set, restricts to articles in this collection
 * @param options - Optional Sanity fetch options
 * @returns Article list sorted by date descending
 */
export async function getFeaturedArticles(
  collection?: ArticleCollection,
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  if (collection === undefined) {
    try {
      const query = `*[_type == "${ARTICLE_DOCUMENT_TYPE}" && isFeatured == true] | order(date desc) ${ARTICLE_PROJECTION}`;
      const articles = await client.fetch<SanityArticle[]>(
        query,
        {},
        options ?? defaultListingOptions
      );
      return Array.isArray(articles) ? articles : [];
    } catch (error) {
      logger.error('Sanity getFeaturedArticles (global) failed', error);
      return [];
    }
  }

  try {
    const c = collectionParam(collection);
    const query = `*[_type == "${ARTICLE_DOCUMENT_TYPE}" && isFeatured == true && (
      coalesce(contentType, "news") == $collection ||
      $collection in coalesce(collections, [])
    )] | order(date desc) ${ARTICLE_PROJECTION}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      { collection: c },
      options ?? defaultListingOptions
    );
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    logger.error('Sanity getFeaturedArticles (collection) failed', error);
    return [];
  }
}

/**
 * Internal articles for the main sitemap slice: excludes career-tagged rows (see {@link getCareersSitemapArticles}).
 *
 * @param options - Optional Sanity fetch options (`revalidate` defaults to sitemap cadence externally)
 * @returns Article list sorted by `_updatedAt` descending when present
 */
export async function getMainSitemapArticles(
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "${ARTICLE_DOCUMENT_TYPE}" && (!defined(offSiteUrl) || offSiteUrl == "") && !(coalesce(contentType, "news") == "careers" || "careers" in coalesce(collections, []))] | order(_updatedAt desc) ${ARTICLE_PROJECTION}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      {},
      options ?? {}
    );
    if (!Array.isArray(articles)) return [];
    return articles.filter(isSitemapArticle);
  } catch (error) {
    logger.error('Sanity getMainSitemapArticles failed', error);
    return [];
  }
}

/**
 * Internal career articles only (`contentType` or `collections` includes `careers`), for a dedicated sitemap file.
 *
 * @param options - Optional Sanity fetch options
 * @returns Article list sorted by `_updatedAt` descending when present
 */
export async function getCareersSitemapArticles(
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "${ARTICLE_DOCUMENT_TYPE}" && (!defined(offSiteUrl) || offSiteUrl == "") && (coalesce(contentType, "news") == "careers" || "careers" in coalesce(collections, []))] | order(_updatedAt desc) ${ARTICLE_PROJECTION}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      {},
      options ?? {}
    );
    if (!Array.isArray(articles)) return [];
    return articles.filter(isSitemapArticle);
  } catch (error) {
    logger.error('Sanity getCareersSitemapArticles failed', error);
    return [];
  }
}
