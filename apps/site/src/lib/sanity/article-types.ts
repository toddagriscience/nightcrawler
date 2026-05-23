// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { PortableTextBlock } from '@portabletext/types';

/** Primary article classifications used across the site and Sanity. */
export const ARTICLE_CONTENT_TYPES = [
  'news',
  'research',
  'story',
  'product-release',
  'press',
  /** Job postings and other careers CMS pages (canonical `/careers/[slug]` template). */
  'careers',
] as const;

/** Type for `news.contentType`. */
export type ArticleContentType = (typeof ARTICLE_CONTENT_TYPES)[number];

/** Allowed collection keys for parent pages (`/news`, `/careers`, future `/research`, etc.). */
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
  /** Primary category for routing (defaults to `news` when missing). */
  contentType?: ArticleContentType;
  /** Secondary parent pages where this article may appear. */
  collections?: ArticleCollection[];
  /** Preferred parent for breadcrumbs or analytics. */
  canonicalParent?: ArticleCollection | string;
  /** When true, omit from dynamic sitemap (internal articles only). */
  excludeFromSitemap?: boolean;
  /** Optional article footer CTA label */
  ctaLabel?: string;
  /** Optional article footer CTA href */
  ctaHref?: string;
}
