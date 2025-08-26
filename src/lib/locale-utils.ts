import { env, SupportedLocale } from './env';

/**
 * Get the display name for a locale
 */
export function getLocaleDisplayName(locale: string): string {
  const localeNames: Record<string, string> = {
    en: 'English',
    es: 'Español',
  };

  return localeNames[locale] || locale;
}

/**
 * Get the flag emoji for a locale
 */
export function getLocaleFlag(locale: string): string {
  const localeFlags: Record<string, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
  };

  return localeFlags[locale] || '🌍';
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return env.supportedLocales.includes(locale as SupportedLocale);
}

/**
 * Get the default locale if the provided one is not supported
 */
export function getFallbackLocale(locale: string): string {
  return isSupportedLocale(locale) ? locale : env.defaultLocale;
}

/**
 * Generate hreflang links for SEO
 */
export function generateHreflangLinks(
  currentPath: string
): Array<{ hreflang: string; href: string }> {
  const baseUrl = env.baseUrl;

  return env.supportedLocales.map((locale) => ({
    hreflang: locale,
    href: `${baseUrl}/${locale}${currentPath}`,
  }));
}

/**
 * Get locale from Accept-Language header
 */
export function parseAcceptLanguage(acceptLanguage: string): string {
  // Parse Accept-Language header like "en-US,en;q=0.9,es;q=0.8"
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, quality] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0], // Get primary language code
        quality: quality ? parseFloat(quality) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first supported locale
  for (const lang of languages) {
    if (isSupportedLocale(lang.code)) {
      return lang.code;
    }
  }

  return env.defaultLocale;
}

/**
 * Get browser locale
 */
export function getBrowserLocale(): string {
  if (typeof window === 'undefined') {
    return env.defaultLocale;
  }

  const browserLocale = navigator.language || navigator.languages?.[0];
  if (!browserLocale) {
    return env.defaultLocale;
  }

  const primaryLocale = browserLocale.split('-')[0];
  return isSupportedLocale(primaryLocale) ? primaryLocale : env.defaultLocale;
}
