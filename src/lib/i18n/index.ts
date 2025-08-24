/**
 * I18n System Barrel Export
 *
 * This file provides a unified interface for the entire internationalization system.
 * Import everything you need from this single entry point.
 */

// Core configuration
export { defaultLocale, locales, type Locale } from './config';

// Translation management
export {
  TranslationManager,
  translationManager,
  TRANSLATION_MODULES,
  type ModuleName,
} from './translation-manager';

// TypeScript types
export type {
  TranslationMessages,
  TranslationKey,
  TranslationParams,
  TranslationFunction,
  TranslationCache,
  TranslationModule,
  I18nConfig,
  LocaleConfig,
  CommonMessages,
  MetadataMessages,
  NavigationMessages,
  HomepageMessages,
  AboutMessages,
  ContactMessages,
  NestedKeyOf,
} from './types';

// Locale-specific exports
export { en } from './messages/en';
export { de } from './messages/de';

// Re-export request utilities if they exist
export * from './request';
