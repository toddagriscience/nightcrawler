/**
 * Hydration fallbacks - English translations loaded synchronously to prevent hydration errors
 */

import commonEn from './messages/en/common.json';
import navigationEn from './messages/en/navigation.json';
import homepageEn from './messages/en/homepage.json';

export const hydrationFallbacks = {
  common: commonEn,
  navigation: navigationEn,
  homepage: homepageEn,
} as const;

/**
 * Get fallback translation for hydration
 */
export function getHydrationFallback(key: string): string {
  const keys = key.split('.');
  let value: unknown = hydrationFallbacks;

  // Navigate through nested object
  for (const k of keys) {
    if (value && typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if not found
    }
  }

  return typeof value === 'string' ? value : key;
}
