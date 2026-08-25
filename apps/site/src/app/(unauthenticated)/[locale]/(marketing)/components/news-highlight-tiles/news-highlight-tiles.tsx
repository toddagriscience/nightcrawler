// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link, routing } from '@/i18n/config';
import {
  ARTICLE_HIGHLIGHT_TILE_COUNT,
  normalizeContentType,
  type ArticleContentType,
  type ArticleHighlightPage,
  type SanityArticle,
} from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { getHighlightedArticlesForPage } from '@/lib/sanity/articles';
import { isOutboundHref, toSafeHref } from '@/lib/sanity/safe-href';
import { urlFor } from '@/lib/sanity/utils';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { topicTabKey } from '../article-index/article-index';

/** Shown when an article has no thumbnail, so the grid keeps its rhythm. */
const ARTICLE_PLACEHOLDER_ROUTE = '/article-placeholder.webp';

/** Square crop requested from Sanity, in pixels. Covers the widest tile at 2x. */
const TILE_IMAGE_SIZE = 800;

/** Resolves an article content type to its localized category label ("Company"). */
export type NewsHighlightCategoryLabel = (type: ArticleContentType) => string;

/** Props for {@link NewsHighlightTiles}. */
export interface NewsHighlightTilesProps {
  /** Articles to tile, already ordered and capped by the caller. */
  articles: SanityArticle[];
  /** Localized category label per content type. */
  categoryLabel: NewsHighlightCategoryLabel;
  /** Section heading above the grid (18px regular). */
  heading: string;
  /** DOM id for the section element; also seeds the heading id. */
  sectionId?: string;
  /** Extra classes on the section — spacing is the caller's, so an empty strip leaves no gap. */
  className?: string;
}

/**
 * Three-tile article highlight strip: square thumbnail, title, and category.
 *
 * Presentational and deliberately static — no carousel, no arrows, no
 * pagination. Renders nothing when there is nothing to highlight, so a page
 * never shows an empty strip. CMS-authored destinations are sanitized with
 * {@link toSafeHref}; a tile whose href is unsafe renders unlinked rather than
 * disappearing.
 *
 * @param props - {@link NewsHighlightTilesProps}
 * @returns The highlight section, or `null` when `articles` is empty
 */
export function NewsHighlightTiles({
  articles,
  categoryLabel,
  heading,
  sectionId,
  className,
}: NewsHighlightTilesProps) {
  if (articles.length === 0) return null;

  const headingId =
    sectionId !== undefined && sectionId.length > 0
      ? `${sectionId}-heading`
      : 'news-highlight-tiles-heading';

  return (
    <section
      aria-labelledby={headingId}
      className={cn('mx-auto w-full max-w-6xl px-4 md:px-6', className)}
      id={sectionId}
    >
      <h2
        className="text-center text-[18px] font-normal leading-7 text-foreground"
        id={headingId}
      >
        {heading}
      </h2>
      <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 md:mt-12 md:grid-cols-3 md:gap-8">
        {articles.map((article) => (
          <li key={article._id}>
            <NewsHighlightTile
              article={article}
              category={categoryLabel(
                normalizeContentType(article.contentType)
              )}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A single tile: square thumbnail over the article title and its category. */
function NewsHighlightTile({
  article,
  category,
}: {
  article: SanityArticle;
  category: string;
}) {
  const thumbnailUrl =
    article.thumbnail?.asset !== undefined
      ? (urlFor(article.thumbnail)
          ?.width(TILE_IMAGE_SIZE)
          .height(TILE_IMAGE_SIZE)
          .url() ?? ARTICLE_PLACEHOLDER_ROUTE)
      : ARTICLE_PLACEHOLDER_ROUTE;

  const body = (
    <>
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-neutral-200">
        <Image
          alt={article.thumbnail?.alt ?? ''}
          className="h-full w-full object-cover"
          height={TILE_IMAGE_SIZE}
          sizes="(min-width: 768px) 33vw, 100vw"
          src={thumbnailUrl}
          width={TILE_IMAGE_SIZE}
        />
      </div>
      <h3 className="mt-4 text-[18px] font-normal leading-[26px] text-foreground">
        {article.title}
      </h3>
      <p className="mt-1 text-[14px] font-normal leading-6 text-[#848484]">
        {category}
      </p>
    </>
  );

  const safeHref = toSafeHref(getArticleCardHref(article));

  // No safe destination — show the tile without a link rather than dropping it.
  if (safeHref === null) {
    return <div className="block text-left">{body}</div>;
  }

  const className =
    'block text-left transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

  if (isOutboundHref(safeHref)) {
    return (
      <a
        className={className}
        href={safeHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        {body}
      </a>
    );
  }

  return (
    <Link className={className} href={safeHref}>
      {body}
    </Link>
  );
}

/** Props for {@link NewsHighlightTilesSection}. */
export interface NewsHighlightTilesSectionProps {
  /** Highlight surface to query; editors opt articles in per page in Studio. */
  page: ArticleHighlightPage;
  /** Active `[locale]` segment, used for the category labels; defaults to English. */
  locale?: string;
  /** Overrides the default localized "Resources" heading. */
  heading?: string;
  /** DOM id for the section element. */
  sectionId?: string;
  /** Extra classes on the section (typically vertical spacing for the host page). */
  className?: string;
}

/**
 * Server component that loads a page's highlighted articles and renders
 * {@link NewsHighlightTiles}.
 *
 * Fetches the three most recent articles an editor tagged for `page` and labels
 * each with its content-type category from the `articleIndex` namespace, so tile
 * categories always read the same as the newsroom and research tabs.
 *
 * @param props - {@link NewsHighlightTilesSectionProps}
 * @returns The rendered strip, or `null` when nothing is highlighted for `page`
 */
export async function NewsHighlightTilesSection({
  page,
  locale,
  heading,
  sectionId,
  className,
}: NewsHighlightTilesSectionProps): Promise<ReactNode> {
  const [articles, t] = await Promise.all([
    getHighlightedArticlesForPage(page, ARTICLE_HIGHLIGHT_TILE_COUNT),
    getTranslations({
      locale: locale ?? routing.defaultLocale,
      namespace: 'articleIndex',
    }),
  ]);

  return (
    <NewsHighlightTiles
      articles={articles}
      categoryLabel={(type) => t(`tabs.${topicTabKey(type)}`)}
      className={className}
      heading={heading ?? t('highlights.heading')}
      sectionId={sectionId}
    />
  );
}
