// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { PortableTextBlock } from '@portabletext/types';

/** Primary article classifications used across the site and Sanity. */
export const ARTICLE_CONTENT_TYPES = [
  'news',
  'research',
  'story',
  'product-release',
  'press',
] as const;

/** Type for `news.contentType`. */
export type ArticleContentType = (typeof ARTICLE_CONTENT_TYPES)[number];

/** Allowed collection keys for Discover / parent pages (`/news`, future `/research`, etc.). */
export const ARTICLE_COLLECTIONS = ARTICLE_CONTENT_TYPES;

export type ArticleCollection = (typeof ARTICLE_COLLECTIONS)[number];

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

/**
 * Article document fetched from Sanity (`_type`: `news`).
 * Editorial fields overlap with Portable Text previews and listing cards.
 */
export interface SanityArticle {
  _id: string;
  _type: 'news';
  _updatedAt?: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  date?: string;
  author?: string;
  company?: string;
  content?: SanityArticlePortableText;
  summary?: string;
  thumbnail?: SanityArticleImageField;
  headerImage?: SanityArticleImageField & { _key?: string };
  /** When set, the article is external and must not expose a canonical on-site detail page. */
  offSiteUrl?: string;
  isFeatured?: boolean;
  source?: string;
  subscripts?: SanityArticleSubscript[];
  /** Primary category for routing (defaults to `news` when missing). */
  contentType?: ArticleContentType;
  /** Secondary parent pages where this article may appear. */
  collections?: ArticleCollection[];
  /** Preferred parent for breadcrumbs or analytics. */
  canonicalParent?: ArticleCollection | string;
  /** When true, omit from dynamic sitemap (internal articles only). */
  excludeFromSitemap?: boolean;
}
