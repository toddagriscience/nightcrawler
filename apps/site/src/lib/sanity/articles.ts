// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client } from '@/lib/sanity/client';
import { logger } from '@/lib/logger';
import type { ArticleCollection } from '@/lib/sanity/article-types';
import {
  ARTICLE_INDEX_TOPIC_TYPES,
  NEWS_TOPIC_TYPES,
} from '@/lib/sanity/article-types';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { FilteredResponseQueryOptions } from 'next-sanity';

/** GROQ `_type` values that share the article detail template and projections. */
const ARTICLE_GROQ_TYPES = '["news", "career"]';

/** One hour ISR for marketing article surfaces. */
const LISTING_REVALIDATE = 60 * 60;

/**
 * GROQ fragment: standalone `career` job documents.
 */
const GROQ_IS_CAREERS_DOC = `_type == "career"`;

/**
 * GROQ field set for standalone `career` job documents (slim; see `career` schema in Sanity).
 */
const GROQ_CAREER_BODY = `
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  jobTeam,
  jobLocation,
  applyUrl,
  content,
  summary,
  excludeFromSitemap
`;

/**
 * GROQ field set for `news` CMS rows.
 */
const GROQ_NEWS_BODY = `
  _id,
  _type,
  _updatedAt,
  title,
  subtitle,
  slug,
  date,
  author,
  company,
  jobLocation,
  jobTeam,
  applyUrl,
  content,
  summary,
  thumbnail,
  headerImage,
  offSiteUrl,
  isFeatured,
  source,
  subscripts,
  "contentType": coalesce(contentType, "news"),
  "collections": coalesce(collections, []),
  canonicalParent,
  excludeFromSitemap,
  ctas[]{
    _key,
    label,
    href,
    placement
  },
  ctaLabel,
  ctaHref
`;

/** Wrapped projection when the query only returns `news` documents. */
const GROQ_NEWS_ONLY = `{${GROQ_NEWS_BODY}}`;

/**
 * Per-`_type` projection for queries that return both `career` and `news` (smaller payload for job templates).
 */
const GROQ_BY_DOCUMENT_TYPE = `{
  _type == "career" => {${GROQ_CAREER_BODY}},
  _type == "news" => {${GROQ_NEWS_BODY}}
}`;

/** Query options reused for article fetch surfaces. */
const defaultListingOptions: FilteredResponseQueryOptions = {
  next: { revalidate: LISTING_REVALIDATE },
};

/**
 * Whether this article is intended to be read on-site (has no off-site URL).
 *
 * @param article - Sanity article document
 * @returns True when the article should render on-site (path is `/index/[slug]` or `/careers/[slug]` based on taxonomy)
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
 * Whether the document counts as careers content for `/careers/search`, `/careers/[slug]`, and the careers sitemap slice.
 *
 * @param article - Document classification from Sanity
 * @returns True when the row is a standalone `career` job posting
 */
export function isCareerArticle(
  article: Pick<SanityArticle, '_type'>
): boolean {
  return article._type === 'career';
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
 * Fetch a single article or career posting by slug.
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
    const query = `*[_type in ${ARTICLE_GROQ_TYPES} && slug.current == $slug] | order(_type asc)[0] ${GROQ_BY_DOCUMENT_TYPE}`;
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
 * Articles for a collection listing; careers returns standalone `career` documents only.
 *
 * @param collection - e.g. `news`, `careers`
 * @param options - Optional Sanity fetch options
 * @returns Article list
 */
export async function getArticlesByCollection(
  collection: ArticleCollection,
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  const c = collectionParam(collection);
  try {
    const query =
      collection === 'careers'
        ? `*[_type in ${ARTICLE_GROQ_TYPES} && (${GROQ_IS_CAREERS_DOC})] | order(coalesce(date, _updatedAt) desc) ${GROQ_BY_DOCUMENT_TYPE}`
        : `*[_type == "news" && (
          coalesce(contentType, "news") == $collection ||
          $collection in coalesce(collections, [])
        )] | order(date desc) ${GROQ_NEWS_ONLY}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      collection === 'careers' ? {} : { collection: c },
      options ?? defaultListingOptions
    );
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    logger.error('Sanity getArticlesByCollection failed', error);
    return [];
  }
}

/**
 * Articles for the research index (`/research/index` and `/research/index/[topic]`).
 *
 * Returns every `news` document whose stored `contentType` is a research topic
 * ({@link ARTICLE_INDEX_TOPIC_TYPES}) or the legacy `research` value (kept so
 * existing rows still surface under the Publication tab after normalization), or
 * that is cross-listed into the `research` collection. Stored values are
 * normalized to the namespaced taxonomy at render time.
 *
 * @param options - Optional Sanity fetch options
 * @returns Article list sorted by date descending
 */
export async function getResearchIndexArticles(
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "news" && (
      coalesce(contentType, "news") in $types ||
      "research" in coalesce(collections, [])
    )] | order(date desc) ${GROQ_NEWS_ONLY}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      { types: [...ARTICLE_INDEX_TOPIC_TYPES, 'research'] },
      options ?? defaultListingOptions
    );
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    logger.error('Sanity getResearchIndexArticles failed', error);
    return [];
  }
}

/**
 * Articles for the news index (`/news`).
 *
 * Returns every `news` document whose stored `contentType` is a news topic
 * ({@link NEWS_TOPIC_TYPES}) or a legacy value that normalizes into the News
 * taxonomy (`news`, `press`, `product-release`, `story`), or that is
 * cross-listed into the `news` collection. Stored values are normalized to the
 * namespaced taxonomy at render time.
 *
 * @param options - Optional Sanity fetch options
 * @returns Article list sorted by date descending
 */
export async function getNewsIndexArticles(
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "news" && (
      coalesce(contentType, "news") in $types ||
      "news" in coalesce(collections, [])
    )] | order(date desc) ${GROQ_NEWS_ONLY}`;
    const articles = await client.fetch<SanityArticle[]>(
      query,
      {
        types: [
          ...NEWS_TOPIC_TYPES,
          'news',
          'press',
          'product-release',
          'story',
        ],
      },
      options ?? defaultListingOptions
    );
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    logger.error('Sanity getNewsIndexArticles failed', error);
    return [];
  }
}

/**
 * Featured documents, optionally scoped to a collection (`careers` uses standalone `career` documents).
 *
 * @param collection - When set, restricts to documents in this collection
 * @param options - Optional Sanity fetch options
 * @returns Article list sorted by date descending
 */
export async function getFeaturedArticles(
  collection?: ArticleCollection,
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  if (collection === undefined) {
    try {
      const query = `*[_type in ${ARTICLE_GROQ_TYPES} && isFeatured == true] | order(coalesce(date, _updatedAt) desc) ${GROQ_BY_DOCUMENT_TYPE}`;
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
    if (collection === 'careers') {
      const query = `*[_type in ${ARTICLE_GROQ_TYPES} && isFeatured == true && (${GROQ_IS_CAREERS_DOC})] | order(coalesce(date, _updatedAt) desc) ${GROQ_BY_DOCUMENT_TYPE}`;
      const articles = await client.fetch<SanityArticle[]>(
        query,
        {},
        options ?? defaultListingOptions
      );
      return Array.isArray(articles) ? articles : [];
    }
    const query = `*[_type == "news" && isFeatured == true && (
      coalesce(contentType, "news") == $collection ||
      $collection in coalesce(collections, [])
    )] | order(date desc) ${GROQ_NEWS_ONLY}`;
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
 * Internal articles for the main sitemap slice: excludes standalone `career` documents (see {@link getCareersSitemapArticles}).
 *
 * @param options - Optional Sanity fetch options (`revalidate` defaults to sitemap cadence externally)
 * @returns Article list sorted by `_updatedAt` descending when present
 */
export async function getMainSitemapArticles(
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  try {
    const query = `*[_type in ${ARTICLE_GROQ_TYPES} && (!defined(offSiteUrl) || offSiteUrl == "") && !(${GROQ_IS_CAREERS_DOC})] | order(_updatedAt desc) ${GROQ_NEWS_ONLY}`;
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
 * Careers sitemap URLs: internal standalone `career` documents.
 *
 * @param options - Optional Sanity fetch options
 * @returns Article list sorted by `_updatedAt` descending when present
 */
export async function getCareersSitemapArticles(
  options?: FilteredResponseQueryOptions
): Promise<SanityArticle[]> {
  try {
    const query = `*[_type in ${ARTICLE_GROQ_TYPES} && (!defined(offSiteUrl) || offSiteUrl == "") && (${GROQ_IS_CAREERS_DOC})] | order(_updatedAt desc) ${GROQ_BY_DOCUMENT_TYPE}`;
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
