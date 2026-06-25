// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { PortableTextBlock } from '@portabletext/types';

/**
 * Research taxonomy content types (namespaced), in render order. Drives the
 * `/research/index` topic tabs and routes. Independent of {@link NEWS_CONTENT_TYPES}.
 */
export const RESEARCH_CONTENT_TYPES = [
  'research-publication',
  'research-conclusion',
  'research-milestone',
  'research-release',
] as const;

/**
 * News taxonomy content types (namespaced), in render order. Drives the `/news`
 * query-param topic tabs. Independent of {@link RESEARCH_CONTENT_TYPES}.
 */
export const NEWS_CONTENT_TYPES = [
  'news-publication',
  'news-milestone',
  'news-release',
  'news-company',
  'news-research',
  'news-global-affairs',
] as const;

/**
 * Every valid `news.contentType` value across both taxonomies. The two
 * taxonomies are namespaced (`research-*` vs `news-*`) and never overlap.
 */
export const ARTICLE_CONTENT_TYPES = [
  ...RESEARCH_CONTENT_TYPES,
  ...NEWS_CONTENT_TYPES,
] as const;

/** Type for `news.contentType`. */
export type ArticleContentType = (typeof ARTICLE_CONTENT_TYPES)[number];

/**
 * Content types surfaced as topics on the research index (`/research/index`
 * and `/research/index/[topic]`). Alias of {@link RESEARCH_CONTENT_TYPES} —
 * single source of truth for the research-index query and the topic tab/route list.
 */
export const ARTICLE_INDEX_TOPIC_TYPES = RESEARCH_CONTENT_TYPES;

/**
 * Topic types for the news index (`/news`) query-param tabs. Alias of
 * {@link NEWS_CONTENT_TYPES} so the GROQ query and the tab bar never drift.
 */
export const NEWS_TOPIC_TYPES = NEWS_CONTENT_TYPES;

/**
 * Legacy (pre-namespacing) stored `contentType` strings mapped to their new
 * namespaced equivalents. Existing Sanity documents keep their old stored
 * string; values are normalized at read time via {@link normalizeContentType}.
 *
 * Consequence: legacy `research` rows stay on the research index under
 * Publication; the other legacy types resolve into the News taxonomy.
 */
export const LEGACY_CONTENT_TYPE_MAP: Record<string, ArticleContentType> = {
  press: 'news-publication',
  news: 'news-company',
  research: 'research-publication',
  'product-release': 'news-release',
  story: 'news-company',
};

/**
 * Normalizes a raw stored `contentType` to a valid {@link ArticleContentType}.
 *
 * Returns the value unchanged when it is already a namespaced type; otherwise
 * falls back to {@link LEGACY_CONTENT_TYPE_MAP} for legacy strings; unknown
 * values default to `news-company`.
 *
 * @param raw - Raw `contentType` string from Sanity (legacy, namespaced, or unknown)
 * @returns The normalized namespaced content type
 */
export function normalizeContentType(
  raw: string | undefined | null
): ArticleContentType {
  if (raw && (ARTICLE_CONTENT_TYPES as readonly string[]).includes(raw)) {
    return raw as ArticleContentType;
  }
  if (raw && raw in LEGACY_CONTENT_TYPE_MAP) {
    return LEGACY_CONTENT_TYPE_MAP[raw];
  }
  return 'news-company';
}

/** Allowed collection keys for parent pages (`/news`, `/careers`, `/research`, etc.). */
export const ARTICLE_COLLECTIONS = [
  ...ARTICLE_CONTENT_TYPES,
  /** Standalone `career` job postings (`/careers/[slug]`). */
  'careers',
] as const;

export type ArticleCollection = (typeof ARTICLE_COLLECTIONS)[number];

/** Where an article CTA pill renders on the marketing article template. */
export const ARTICLE_CTA_PLACEMENTS = ['under-header', 'footer'] as const;

/** Placement key for {@link SanityArticleCta}. */
export type ArticleCtaPlacement = (typeof ARTICLE_CTA_PLACEMENTS)[number];

/** One CMS-configured call-to-action button on an article page. */
export interface SanityArticleCta {
  /** Sanity array item key */
  _key?: string;
  /** Pill button label */
  label: string;
  /** Internal path or absolute URL */
  href: string;
  /** Renders below the hero header or after the article footer */
  placement: ArticleCtaPlacement;
}

/** Image field shape reused from Sanity for articles. */
export interface SanityArticleImageField {
  _type?: string;
  alt?: string;
  asset?: { _ref?: string; _type?: string };
}

/** Portable Text block typed loosely for Sanity `news.content`. */
export type SanityArticlePortableText = PortableTextBlock[] | undefined;

/** Subscript entry on a news/article document. */
export interface SanityArticleSubscript {
  label?: string;
  text: string;
  url?: string;
}

/** Article-like document returned from Sanity (`news` or standalone `career` job posts). */
export interface SanityArticle {
  _id: string;
  _type: 'news' | 'career';
  _updatedAt?: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  date?: string;
  author?: string;
  company?: string;
  /** Job location (`career` documents); listings and `/careers/[slug]` hero. */
  jobLocation?: string;
  /** Job posting team label (`career` documents); editors may omit on legacy rows. */
  jobTeam?: string;
  /** Apply CTA destination for internal career postings (`career`). */
  applyUrl?: string;
  content?: SanityArticlePortableText;
  summary?: string;
  thumbnail?: SanityArticleImageField;
  headerImage?: SanityArticleImageField & { _key?: string };
  /** When set, the article is external and must not expose a canonical on-site detail page. */
  offSiteUrl?: string;
  isFeatured?: boolean;
  source?: string;
  subscripts?: SanityArticleSubscript[];
  /** Primary category for routing; legacy/unknown values normalize to `news-company`. */
  contentType?: ArticleContentType;
  /** Secondary parent pages where this article may appear. */
  collections?: ArticleCollection[];
  /** Preferred parent for breadcrumbs or analytics. */
  canonicalParent?: ArticleCollection | string;
  /** When true, omit from dynamic sitemap (internal articles only). */
  excludeFromSitemap?: boolean;
  /** CMS call-to-action buttons (0 or more). */
  ctas?: SanityArticleCta[];
  /**
   * @deprecated Legacy single footer CTA — migrated in {@link resolveArticleCtas}.
   */
  ctaLabel?: string;
  /**
   * @deprecated Legacy single footer CTA — migrated in {@link resolveArticleCtas}.
   */
  ctaHref?: string;
}
