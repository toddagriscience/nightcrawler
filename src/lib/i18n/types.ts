/**
 * TypeScript types for the i18n system
 *
 * This file provides type safety for all translation modules
 * and ensures consistency across different locales.
 */

// Import the English translations as the source of truth for types
import type { en } from './messages/en';

/**
 * Base translation structure - derived from English locale
 */
export type TranslationMessages = typeof en;

/**
 * Individual module types
 */
export type CommonMessages = TranslationMessages['common'];
export type MetadataMessages = TranslationMessages['metadata'];
export type NavigationMessages = TranslationMessages['navigation'];
export type HomepageMessages = TranslationMessages['homepage'];
export type AboutMessages = TranslationMessages['about'];
export type ContactMessages = TranslationMessages['contact'];

/**
 * Utility type to get nested keys from translation objects
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * Translation key type - all possible dot-notation keys
 */
export type TranslationKey = NestedKeyOf<TranslationMessages>;

/**
 * Translation parameters for interpolation
 */
export type TranslationParams = Record<string, string | number>;

/**
 * Translation function signature
 */
export type TranslationFunction = (
  key: TranslationKey,
  params?: TranslationParams
) => string;

/**
 * Module loading state for lazy loading
 */
export interface ModuleLoadState {
  isLoaded: boolean;
  isLoading: boolean;
  error?: Error;
}

/**
 * Translation module metadata
 */
export interface TranslationModule {
  name: keyof TranslationMessages;
  path: string;
  loadState: ModuleLoadState;
  data?: Record<string, unknown>;
}

/**
 * Locale configuration
 */
export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
  modules: TranslationModule[];
}

/**
 * Translation cache for performance
 */
export interface TranslationCache {
  [locale: string]: {
    [module: string]: Record<string, unknown>;
  };
}

/**
 * Translation loading strategy
 */
export type LoadingStrategy = 'eager' | 'lazy' | 'on-demand';

/**
 * I18n configuration options
 */
export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  loadingStrategy: LoadingStrategy;
  fallbackLocale: string;
  enableCache: boolean;
  cacheTimeout?: number;
}
