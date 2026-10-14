// Copyright © Todd Agriscience, Inc. All rights reserved.

import { env } from '@/lib/env';

/** Final navigation path: English is unprefixed and Spanish uses `/es`; queries and fragments are preserved. */
export function getLocalizedPath(path: string, locale = 'en'): string {
  const suffix = path.match(/[?#].*$/)?.[0] ?? '';
  const cleanPath =
    path
      .split(/[?#]/)[0]
      .replace(/^\/(?:en|es)(?=\/|$)/, '')
      .replace(/\/+$/, '') || '/';
  const pathname = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${locale === 'es' ? `/es${pathname === '/' ? '' : pathname}` : pathname}${suffix}`;
}

/** Absolute final URL shared by canonical tags, Open Graph and sitemaps. */
export function getCanonicalUrl(path: string, locale = 'en'): string {
  return `${env.baseUrl.replace(/\/+$/, '')}${getLocalizedPath(path.split(/[?#]/)[0], locale)}`;
}

/** Reciprocal language URLs for marketing pages with both checked-in translations. */
export function getPageAlternates(path: string, locale: string) {
  return {
    canonical: getCanonicalUrl(path, locale),
    languages: {
      en: getCanonicalUrl(path, 'en'),
      es: getCanonicalUrl(path, 'es'),
      'x-default': getCanonicalUrl(path, 'en'),
    },
  };
}
