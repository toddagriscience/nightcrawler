// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * BCP 47 locale for presenting Sanity article timestamps in the UI (news cards, careers listings,
 * article hero, etc.), independent of the site `[locale]` route.
 */
export const ARTICLE_DISPLAY_DATE_LOCALE = 'en-GB';

/**
 * Formats a Sanity article ISO date for list rows and cards (long month, same English locale as hero dates).
 *
 * @param dateValue - ISO date string when present
 * @returns Formatted date or empty string when missing
 */
export function formatArticleListDate(dateValue: string | undefined): string {
  const safe = dateValue !== undefined && dateValue.length > 0 ? dateValue : '';
  if (safe.length === 0) return '';
  return new Date(safe).toLocaleDateString(ARTICLE_DISPLAY_DATE_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
