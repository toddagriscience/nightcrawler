// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { PortableTextBlock } from '@portabletext/types';

/** Primary article content types for `news` documents in Sanity. */
export const ARTICLE_CONTENT_TYPES = [
  'news',
  'research',
  'story',
  'product-release',
  'press',
] as const;

/** Type for `news.contentType`. */
export type ArticleContentType = (typeof ARTICLE_CONTENT_TYPES)[number];

/** Allowed collection keys for parent pages (`/news`, `/careers`, future `/research`, etc.). */
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
  /** Primary category for routing (defaults to `news` when missing). */
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
