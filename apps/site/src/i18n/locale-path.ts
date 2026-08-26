// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';

/**
 * Rewrites a pathname so that it resolves under a different locale.
 *
 * Routing runs with `localePrefix: 'as-needed'`, so the default locale is served
 * with no prefix (`/research/index`) and every other locale with one
 * (`/es/research/index`). Replacing the first segment in place only works when a
 * prefix is already there — otherwise it overwrites the page itself. So any
 * leading locale segment is stripped first, and the prefix is re-added only for
 * non-default locales.
 *
 * @param {string} pathname - The current pathname, with or without a locale prefix
 * @param {string} locale - The locale the pathname should be rendered under
 * @returns {string} - The equivalent pathname under the given locale
 */
export function localizePathname(pathname: string, locale: string): string {
  const locales: readonly string[] = routing.locales;
  const segments = pathname.split('/');

  if (locales.includes(segments[1])) {
    segments.splice(1, 1);
  }

  const unprefixed = segments.join('/') || '/';

  if (locale === routing.defaultLocale) {
    return unprefixed;
  }

  return unprefixed === '/' ? `/${locale}` : `/${locale}${unprefixed}`;
}
