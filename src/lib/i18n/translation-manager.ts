/**
 * Translation Manager
 *
 * Handles lazy loading, caching, and module management for the i18n system.
 * Provides performance optimization through selective module loading.
 */

import { type Locale } from './config';
import type {
  TranslationMessages,
  TranslationCache,
  I18nConfig,
  TranslationParams,
} from './types';

/**
 * Available translation modules
 */
export const TRANSLATION_MODULES = [
  'common',
  'metadata',
  'navigation',
  'homepage',
  'about',
  'contact',
] as const;

export type ModuleName = (typeof TRANSLATION_MODULES)[number];

/**
 * Translation Manager Class
 */
export class TranslationManager {
  private cache: TranslationCache = {};
  private loadingPromises: Map<string, Promise<Record<string, unknown>>> =
    new Map();
  private config: I18nConfig;

  constructor(config: Partial<I18nConfig> = {}) {
    this.config = {
      defaultLocale: 'en',
      supportedLocales: ['en', 'de', 'es', 'fr', 'it', 'ja', 'pt'],
      loadingStrategy: 'lazy',
      fallbackLocale: 'en',
      enableCache: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      ...config,
    };
  }

  /**
   * Load a specific module for a locale
   */
  async loadModule(
    locale: Locale,
    moduleName: ModuleName
  ): Promise<Record<string, unknown>> {
    const cacheKey = `${locale}-${moduleName}`;

    // Return cached version if available
    if (this.cache[locale]?.[moduleName]) {
      return this.cache[locale][moduleName];
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    // Create loading promise
    const loadingPromise = this.performModuleLoad(locale, moduleName);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const moduleData = await loadingPromise;

      // Cache the result
      if (this.config.enableCache) {
        if (!this.cache[locale]) {
          this.cache[locale] = {};
        }
        this.cache[locale][moduleName] = moduleData;
      }

      return moduleData;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Perform the actual module loading
   */
  private async performModuleLoad(
    locale: Locale,
    moduleName: ModuleName
  ): Promise<Record<string, unknown>> {
    try {
      // Dynamic import based on locale and module
      const moduleData = await import(
        `./messages/${locale}/${moduleName}.json`
      );
      return moduleData.default;
    } catch (error) {
      console.warn(
        `Failed to load module ${moduleName} for locale ${locale}:`,
        error
      );

      // Fallback to default locale if different
      if (locale !== this.config.fallbackLocale) {
        try {
          const fallbackModuleData = await import(
            `./messages/${this.config.fallbackLocale}/${moduleName}.json`
          );
          return fallbackModuleData.default;
        } catch (fallbackError) {
          console.error(
            `Failed to load fallback module ${moduleName}:`,
            fallbackError
          );
          return {};
        }
      }

      return {};
    }
  }

  /**
   * Load all modules for a locale
   */
  async loadAllModules(locale: Locale): Promise<TranslationMessages> {
    const modulePromises = TRANSLATION_MODULES.map(async (moduleName) => {
      const moduleData = await this.loadModule(locale, moduleName);
      return [moduleName, moduleData] as const;
    });

    const results = await Promise.all(modulePromises);

    return results.reduce((acc, [moduleName, moduleData]) => {
      (acc as Record<string, unknown>)[moduleName] = moduleData;
      return acc;
    }, {} as TranslationMessages);
  }

  /**
   * Load modules on-demand based on usage patterns
   */
  async loadModulesOnDemand(
    locale: Locale,
    requiredModules: ModuleName[]
  ): Promise<Partial<TranslationMessages>> {
    const modulePromises = requiredModules.map(async (moduleName) => {
      const moduleData = await this.loadModule(locale, moduleName);
      return [moduleName, moduleData] as const;
    });

    const results = await Promise.all(modulePromises);

    return results.reduce((acc, [moduleName, moduleData]) => {
      (acc as Record<string, unknown>)[moduleName] = moduleData;
      return acc;
    }, {} as Partial<TranslationMessages>);
  }

  /**
   * Get translation value - loads modules synchronously from cache or falls back to English
   */
  getTranslation(
    locale: Locale,
    key: string,
    params?: TranslationParams,
    loadedMessages?: Partial<TranslationMessages>
  ): string {
    // If messages provided, use the old logic
    if (loadedMessages && Object.keys(loadedMessages).length > 0) {
      return this.getTranslationFromMessages(key, params, loadedMessages);
    }

    // Otherwise, try to get from cache
    const moduleName = this.getModuleNameFromKey(key);
    if (!moduleName) {
      console.warn(`Cannot determine module for key: ${key}`);
      return this.getFallbackTranslation(key, params);
    }

    const cachedModule = this.cache[locale]?.[moduleName];
    if (!cachedModule) {
      // Module not cached, trigger async load and try English fallback
      this.loadModule(locale, moduleName).catch(console.warn);
      return this.getFallbackTranslation(key, params);
    }

    // Get translation from cached module
    const mockMessages = { [moduleName]: cachedModule };
    const translation = this.getTranslationFromMessages(
      key,
      params,
      mockMessages
    );

    // If translation failed (returned key), try English fallback
    if (translation === key) {
      return this.getFallbackTranslation(key, params);
    }

    return translation;
  }

  /**
   * Get English fallback translation
   */
  private getFallbackTranslation(
    key: string,
    params?: TranslationParams
  ): string {
    const moduleName = this.getModuleNameFromKey(key);
    if (!moduleName) return key;

    // Try to get English version
    const englishModule = this.cache['en']?.[moduleName];
    if (englishModule) {
      const mockMessages = { [moduleName]: englishModule };
      const translation = this.getTranslationFromMessages(
        key,
        params,
        mockMessages
      );
      if (translation !== key) return translation;
    }

    // Load English module in background if not available
    if (!englishModule) {
      this.loadModule('en', moduleName).catch(console.warn);
    }

    return key;
  }

  /**
   * Extract translation from messages object
   */
  private getTranslationFromMessages(
    key: string,
    params?: TranslationParams,
    messages?: Partial<TranslationMessages>
  ): string {
    if (!messages) return key;

    const keys = key.split('.');
    let value: unknown = messages;

    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Simple parameter replacement
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined
          ? String(params[paramKey])
          : match;
      });
    }

    return value;
  }

  /**
   * Determine module name from translation key
   */
  private getModuleNameFromKey(key: string): ModuleName | null {
    if (key.startsWith('homepage.')) return 'homepage';
    if (key.startsWith('about.')) return 'about';
    if (key.startsWith('contact.')) return 'contact';
    if (
      key.startsWith('navigation.') ||
      key.startsWith('footer.') ||
      key.startsWith('header.')
    )
      return 'navigation';
    if (key.startsWith('metadata.')) return 'metadata';
    if (
      key.startsWith('common.') ||
      key.startsWith('buttons.') ||
      key.startsWith('errors.') ||
      key.startsWith('success.')
    )
      return 'common';
    return null;
  }

  /**
   * Clear cache for a specific locale or all locales
   */
  clearCache(locale?: Locale): void {
    if (locale) {
      delete this.cache[locale];
    } else {
      this.cache = {};
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number;
    locales: string[];
    modules: Record<string, string[]>;
  } {
    const locales = Object.keys(this.cache);
    const modules: Record<string, string[]> = {};
    let totalEntries = 0;

    locales.forEach((locale) => {
      modules[locale] = Object.keys(this.cache[locale] || {});
      totalEntries += modules[locale].length;
    });

    return { totalEntries, locales, modules };
  }

  /**
   * Preload critical modules for better performance
   */
  async preloadCriticalModules(locale: Locale): Promise<void> {
    const criticalModules: ModuleName[] = ['common', 'navigation'];

    try {
      await this.loadModulesOnDemand(locale, criticalModules);
    } catch (error) {
      console.warn('Failed to preload critical modules:', error);
    }
  }
}

// Singleton instance
export const translationManager = new TranslationManager();

export default TranslationManager;
