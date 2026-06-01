// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  ARTICLE_CTA_PLACEMENTS,
  type ArticleCtaPlacement,
  type SanityArticle,
  type SanityArticleCta,
} from '@/lib/sanity/article-types';

/** Article fields used to resolve CTA buttons. */
export type ArticleCtaSource = Pick<
  SanityArticle,
  'ctas' | 'ctaLabel' | 'ctaHref'
>;

/**
 * Returns true when a string is non-empty after trimming.
 *
 * @param value - Raw string
 */
function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Normalizes CMS CTA rows and falls back to legacy single footer CTA fields.
 *
 * @param article - Sanity article document (or subset with CTA fields)
 */
export function resolveArticleCtas(
  article: ArticleCtaSource
): SanityArticleCta[] {
  const fromArray = (article.ctas ?? [])
    .filter(
      (cta): cta is SanityArticleCta =>
        hasText(cta.label) &&
        hasText(cta.href) &&
        ARTICLE_CTA_PLACEMENTS.includes(cta.placement)
    )
    .map((cta) => ({
      ...cta,
      label: cta.label.trim(),
      href: cta.href.trim(),
    }));

  if (fromArray.length > 0) {
    return fromArray;
  }

  if (hasText(article.ctaLabel) && hasText(article.ctaHref)) {
    return [
      {
        label: article.ctaLabel.trim(),
        href: article.ctaHref.trim(),
        placement: 'footer',
      },
    ];
  }

  return [];
}

/**
 * Returns CTAs for one placement region on the article template.
 *
 * @param article - Sanity article document (or subset with CTA fields)
 * @param placement - Under header or footer
 */
export function getArticleCtasForPlacement(
  article: ArticleCtaSource,
  placement: ArticleCtaPlacement
): SanityArticleCta[] {
  return resolveArticleCtas(article).filter(
    (cta) => cta.placement === placement
  );
}
