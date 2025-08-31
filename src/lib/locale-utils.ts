// Copyright Todd LLC, All rights reserved.

import { env } from './env';
import { routing } from '@/i18n/config';
import { LOCALE_NAMES, LOCALE_FLAGS, type SupportedLocale } from './locales';

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
 * Generate hreflang links for SEO
 * @param {string} currentPath - The current path
 * @returns {Array<{ hreflang: string; href: string }>} - The hreflang links
 */
export function generateHreflangLinks(
  currentPath: string
): Array<{ hreflang: string; href: string }> {
  const baseUrl = env.baseUrl;

  return routing.locales.map((locale) => ({
    hreflang: locale,
    href: `${baseUrl}/${locale}${currentPath}`,
  }));
}
