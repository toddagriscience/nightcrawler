// Copyright © Todd Agriscience, Inc. All rights reserved.

import { resolveArticleDisplayDateLocale } from '@/lib/sanity/article-display-dates';
import type { SanityArticle } from '@/lib/sanity/article-types';

import type { ArticleUiSubscript } from './types';

/**
 * Formats a Sanity article ISO date string for hero display, presented in the reader's locale.
 *
 * @param isoDate - ISO date string when present
 * @param locale - Site locale segment; falls back to English when omitted
 * @returns Formatted string such as \"20 November, 2025\" or \"20 de noviembre de 2025\", or empty when missing
 */
export function formatArticleHeroDate(
  isoDate: unknown,
  locale?: string
): string {
  if (isoDate == null) return '';

  const displayLocale = resolveArticleDisplayDateLocale(locale);
  const formatted = new Date(isoDate as string).toLocaleDateString(
    displayLocale,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  // English hero dates separate the year with a comma ("20 November, 2025"). Spanish already reads
  // "20 de noviembre de 2025", where the same comma would land mid-phrase, so it stays English-only.
  return displayLocale.startsWith('en')
    ? formatted.replace(/\s(\d{4})$/, ', $1')
    : formatted;
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
