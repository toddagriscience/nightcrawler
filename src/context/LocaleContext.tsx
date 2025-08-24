'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';
import {
  translationManager,
  type ModuleName,
} from '@/lib/i18n/translation-manager';
import { getHydrationFallback } from '@/lib/i18n/hydration-fallbacks';
import type {
  TranslationMessages,
  TranslationKey,
  TranslationParams,
  TranslationFunction,
} from '@/lib/i18n/types';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Partial<TranslationMessages>;
  t: TranslationFunction;
  isLoading: boolean;
  loadModule: (moduleName: ModuleName) => Promise<void>;
  loadModules: (moduleNames: ModuleName[]) => Promise<void>;
  preloadCritical: () => Promise<void>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Preload English modules immediately on component creation
  React.useMemo(() => {
    const essentialModules: ModuleName[] = ['common', 'navigation', 'homepage'];
    essentialModules.forEach((module) => {
      translationManager.loadModule('en', module).catch(console.warn);
    });
  }, []);

  // Detect user's preferred locale and preload modules on mount
  useEffect(() => {
    const initializeLocale = async () => {
      let detectedLocale = defaultLocale;

      // First check localStorage for saved preference
      const savedLocale = localStorage.getItem('preferred-locale') as Locale;
      if (savedLocale && locales.includes(savedLocale)) {
        detectedLocale = savedLocale;
      } else {
        // Then check browser language settings
        const browserLangs = navigator.languages || [navigator.language];
        for (const lang of browserLangs) {
          const primaryLang = lang.split('-')[0].toLowerCase();
          if (locales.includes(primaryLang as Locale)) {
            detectedLocale = primaryLang as Locale;
            break;
          }
        }
      }

      // Only update locale if it's different from default
      if (detectedLocale !== defaultLocale) {
        setLocale(detectedLocale);
      }

      // Preload detected locale modules if different from English
      if (detectedLocale !== 'en') {
        const essentialModules: ModuleName[] = [
          'common',
          'navigation',
          'homepage',
        ];
        try {
          await Promise.all(
            essentialModules.map((module) =>
              translationManager.loadModule(detectedLocale, module)
            )
          );
        } catch (error) {
          console.warn('Failed to preload locale modules:', error);
        }
      }

      setIsHydrated(true);
    };

    initializeLocale();
  }, []);

  // Save locale preference when changed and preload modules
  const handleSetLocale = useCallback(async (newLocale: Locale) => {
    setIsLoading(true);
    setLocale(newLocale);

    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }

    // Start timer to ensure minimum loading time for smooth UX
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));

    // Preload essential modules for the new locale
    const essentialModules: ModuleName[] = ['common', 'navigation', 'homepage'];
    const loadModules = Promise.all(
      essentialModules.map((module) =>
        translationManager.loadModule(newLocale, module)
      )
    );

    try {
      // Wait for both the modules to load AND minimum time to pass
      await Promise.all([loadModules, minLoadingTime]);
    } catch (error) {
      console.warn('Failed to preload modules for new locale:', error);
      // Still wait for minimum time even if modules fail
      await minLoadingTime;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simple translation function that fetches fresh translations
  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      // During hydration, use synchronously imported English fallbacks
      if (!isHydrated) {
        return getHydrationFallback(key);
      }

      try {
        const translation = translationManager.getTranslation(
          locale,
          key,
          params
        );

        // Log missing translation keys for debugging
        if (translation === key && process.env.NODE_ENV === 'development') {
          console.warn(`Translation key not found: ${key}`);
        }

        return translation;
      } catch (error) {
        console.warn(`Translation error for key ${key}:`, error);
        return getHydrationFallback(key);
      }
    },
    [locale, isHydrated]
  );

  // Simplified no-op functions for compatibility
  const loadModule = useCallback(async () => {}, []);
  const loadModules = useCallback(async () => {}, []);
  const preloadCritical = useCallback(async () => {}, []);

  const value = {
    locale,
    setLocale: handleSetLocale,
    messages: {}, // Empty since we fetch fresh each time
    t,
    isLoading,
    loadModule,
    loadModules,
    preloadCritical,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};
