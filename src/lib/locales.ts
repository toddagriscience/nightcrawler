//Copyright Todd LLC, All rights reserved.

import { routing } from '@/i18n/config';

export const SUPPORTED_LOCALES = routing.locales;
export type SupportedLocale = (typeof routing.locales)[number];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
} as const;

export const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
} as const;
