// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
import { SUPPORTED_LOCALES } from './locales';
import { Locale } from 'next-intl';

/** Routes that are not locale-prefixed marketing pages. */
const UNAUTH_UNINTL_ROOT_SEGMENTS = [
  'incoming',
  'auth',
  'externship-terms',
  'invite',
  'creators',
  'accept',
];

/**
 * Returns the explicit locale segment from a pathname when present.
 *
 * @param pathname - Full request pathname
 */
export function getPathnameLocale(pathname: string): Locale | null {
  if (pathname.length <= 1) {
    return null;
  }

  const segment = pathname.split('/')[1];
  if (SUPPORTED_LOCALES.includes(segment as Locale)) {
    return segment as Locale;
  }

  return null;
}

/**
 * Returns the first marketing segment after an optional locale prefix.
 *
 * @param pathname - Full request pathname
 * @example `/es/privacy` → `privacy`, `/privacy` → `privacy`
 */
export function getIntlMarketingSegment(pathname: string): string | undefined {
  const locale = getPathnameLocale(pathname);
  const segments = pathname.split('/').filter(Boolean);

  if (locale) {
    return segments[1];
  }

  return segments[0];
}

/** Helper function to check for internationalized routes.
 *
 * @param pathname The entire path, from request.nextUrl.pathname
 * @returns Whether the route is internationalized */
export function isRouteInternationalized(pathname: string): boolean {
  const explicitLocale = getPathnameLocale(pathname);
  if (explicitLocale) {
    return true;
  }

  if (pathname === '/' || pathname === '') {
    return true;
  }

  const firstSegment = pathname.split('/')[1];
  if (UNAUTH_UNINTL_ROOT_SEGMENTS.includes(firstSegment)) {
    return false;
  }

  return pathname.length > 1;
}

/**
 * Whether a pathname uses the legacy `/en/...` prefix (redirected by next-intl).
 *
 * @param pathname - Full request pathname
 */
export function hasLegacyDefaultLocalePrefix(pathname: string): boolean {
  return (
    pathname === `/${routing.defaultLocale}` ||
    pathname.startsWith(`/${routing.defaultLocale}/`)
  );
}
