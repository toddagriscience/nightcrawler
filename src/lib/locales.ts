// Copyright (c) Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';

/**
 * Supported locales
 * @returns {string[]} - The supported locales
 */
export const SUPPORTED_LOCALES = routing.locales;

/**
 * Supported locale type
 * @returns {string} - The supported locale
 */
export type SupportedLocale = (typeof routing.locales)[number];

/**
 * Locale names
 * @returns {Record<SupportedLocale, string>} - The locale names
 */
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
} as const;

/**
 * Locale flags
 * @returns {Record<SupportedLocale, string>} - The locale flags
 */
export const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
} as const;
