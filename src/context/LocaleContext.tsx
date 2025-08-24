'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';

type Messages = Record<string, string | Record<string, string>>;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
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
  const [messages, setMessages] = useState<Messages>({});

  // Load messages when locale changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageModule = await import(
          `@/lib/i18n/messages/${locale}.json`
        );
        setMessages(messageModule.default);
      } catch (error) {
        console.warn(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to English if locale messages don't exist
        if (locale !== defaultLocale) {
          try {
            const fallbackModule = await import(
              `@/lib/i18n/messages/${defaultLocale}.json`
            );
            setMessages(fallbackModule.default);
          } catch (fallbackError) {
            console.error('Failed to load fallback messages', fallbackError);
            setMessages({});
          }
        }
      }
    };

    loadMessages();
  }, [locale]);

  // Detect user's preferred locale from browser settings and localStorage
  useEffect(() => {
    const detectLocale = () => {
      // First check localStorage for saved preference
      const savedLocale = localStorage.getItem('preferred-locale') as Locale;
      if (savedLocale && locales.includes(savedLocale)) {
        return savedLocale;
      }

      // Then check browser language settings
      const browserLangs = navigator.languages || [navigator.language];

      for (const lang of browserLangs) {
        // Get the primary language code (e.g., 'en' from 'en-US')
        const primaryLang = lang.split('-')[0].toLowerCase();

        // Check if we support this language
        if (locales.includes(primaryLang as Locale)) {
          return primaryLang as Locale;
        }
      }

      // Fallback to default locale
      return defaultLocale;
    };

    // Only update if we're on the client side
    if (typeof window !== 'undefined') {
      const detectedLocale = detectLocale();
      if (detectedLocale !== locale) {
        setLocale(detectedLocale);
      }
    }
  }, [locale]);

  // Save locale preference
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
  };

  // Simple translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
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
  };

  const value = {
    locale,
    setLocale: handleSetLocale,
    messages,
    t,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};
