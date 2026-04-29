// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';

import type { ArticleUiSubscript } from './types';

/**
 * Formats a Sanity article ISO date string for hero display (British-style ordering).
 *
 * @param isoDate - ISO date string when present
 * @returns Formatted string such as \"20 November 2025\" or empty when missing
 */
export function formatArticleHeroDate(isoDate: unknown): string {
  return isoDate != null
    ? new Date(isoDate as string)
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        .replace(/\s(\d{4})$/, ', $1')
    : '';
}

/**
 * Returns subscript rows safe for rendering beneath the article body.
 *
 * @param article - Sanity article
 * @returns Filtered footnote list
 */
export function parseArticleSubscripts(
  article: SanityArticle
): ArticleUiSubscript[] {
  const raw = article.subscripts;
  return Array.isArray(raw)
    ? raw.filter(
        (item): item is ArticleUiSubscript =>
          typeof item?.text === 'string' && item.text.trim().length > 0
      )
    : [];
}
