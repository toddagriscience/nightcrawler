'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { env, SupportedLocale } from '@/lib/env';

export function useLocaleDetection() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = useCallback(
    (newLocale: string) => {
      if (!env.supportedLocales.includes(newLocale as SupportedLocale)) {
        console.warn(`Unsupported locale: ${newLocale}`);
        return;
      }

      // Remove current locale from pathname and add new one
      const segments = pathname.split('/');
      segments[1] = newLocale; // Replace locale segment
      const newPath = segments.join('/');

      router.push(newPath);
    },
    [pathname, router]
  );

  const getLocaleFromPath = useCallback(() => {
    const segments = pathname.split('/');
    return segments[1] || env.defaultLocale;
  }, [pathname]);

  const isCurrentLocale = useCallback(
    (checkLocale: string) => {
      return locale === checkLocale;
    },
    [locale]
  );

  const getAlternateLocales = useCallback(() => {
    return env.supportedLocales.filter((l) => l !== locale);
  }, [locale]);

  return {
    currentLocale: locale,
    switchLocale,
    getLocaleFromPath,
    isCurrentLocale,
    getAlternateLocales,
    supportedLocales: env.supportedLocales,
    defaultLocale: env.defaultLocale,
  };
}
