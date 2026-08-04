// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * BCP 47 locale used to present Sanity article timestamps when the site `[locale]` route segment
 * is missing or unrecognised.
 */
export const ARTICLE_DISPLAY_DATE_LOCALE = 'en-GB';

/**
 * BCP 47 locale used to present Sanity article timestamps (news cards, careers listings, article
 * hero, etc.) for each supported site locale.
 *
 * English stays on `en-GB` so the day-first ordering already shipped on article surfaces
 * ("1 June 2026") is unchanged.
 */
const ARTICLE_DISPLAY_DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  es: 'es-ES',
};

/**
 * Resolves a site `[locale]` route segment to the BCP 47 locale used to present article dates.
 *
 * @param locale - Site locale segment (`en`, `es`) when known
 * @returns Matching BCP 47 locale, or {@link ARTICLE_DISPLAY_DATE_LOCALE} for unknown input
 */
export function resolveArticleDisplayDateLocale(locale?: string): string {
  return (
    (locale !== undefined ? ARTICLE_DISPLAY_DATE_LOCALES[locale] : undefined) ??
    ARTICLE_DISPLAY_DATE_LOCALE
  );
}

/**
 * Formats a Sanity article ISO date for list rows and cards (long month, presented in the reader's
 * locale).
 *
 * @param dateValue - ISO date string when present
 * @param locale - Site locale segment; falls back to English when omitted
 * @returns Formatted date or empty string when missing
 */
export function formatArticleListDate(
  dateValue: string | undefined,
  locale?: string
): string {
  const safe = dateValue !== undefined && dateValue.length > 0 ? dateValue : '';
  if (safe.length === 0) return '';
  return new Date(safe).toLocaleDateString(
    resolveArticleDisplayDateLocale(locale),
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
}
