// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
import { LOCALE_FLAGS, LOCALE_NAMES, type SupportedLocale } from './locales';
import { env } from './env';

/**
 * Get the display name for a locale
 * @param {string} locale - The locale to get the display name for
 * @returns {string} - The display name for the locale
 */
export function getLocaleDisplayName(locale: string): string {
  return LOCALE_NAMES[locale as SupportedLocale] || locale;
}

/**
 * Get the flag emoji for a locale
 * @param {string} locale - The locale to get the flag for
 * @returns {string} - The flag emoji for the locale
 */
export function getLocaleFlag(locale: string): string {
  return LOCALE_FLAGS[locale as SupportedLocale] || '🌍';
}

/**
 * Builds a public URL path with locale prefix only for non-default locales.
 *
 * @param locale - Locale code (`en`, `es`, …)
 * @param path - Path starting with `/` (e.g. `/about`, `/`)
 * @returns Localized path (`/about` for `en`, `/es/about` for `es`)
 */
export function getLocalizedPath(locale: string, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (locale === routing.defaultLocale) {
    return normalized;
  }

  if (normalized === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

/**
 * Builds an absolute URL for a locale and path using the site base URL.
 *
 * @param locale - Locale code
 * @param path - Path starting with `/`
 * @returns Absolute URL
 */
export function getLocalizedUrl(locale: string, path: string): string {
  const base = env.baseUrl.replace(/\/$/, '');
  const localizedPath = getLocalizedPath(locale, path);
  return localizedPath === '/' ? base : `${base}${localizedPath}`;
}

/**
 * Generate hreflang links for SEO
 * @param {string} currentPath - The current path without locale prefix (e.g. `/about`)
 * @returns {Array<{ hreflang: string; href: string }>} - The hreflang links
 */
export function generateHreflangLinks(
  currentPath: string
): Array<{ hreflang: string; href: string }> {
  const path = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

  return routing.locales.map((locale) => ({
    hreflang: locale,
    href: getLocalizedUrl(locale, path),
  }));
}
