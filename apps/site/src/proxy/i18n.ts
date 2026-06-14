// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing, SUPPORTED_LOCALES } from '@/i18n/config';
import { Locale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

/** Routes that are uninternationalized and only accessible to the public */
const unauthUnintlRoutes = [
  'auth',
  'externship-terms',
  // Only for go.toddagriscience.com
  'invite',
  'creators',
  'signup',
];

/**
 * Next-intl middleware instance
 * @returns {createMiddleware} - The next-intl middleware instance
 * @param {boolean} isAuthenticated - The authentication status
 */
export const intlMiddleware = createMiddleware(routing);

/**
 * Handle internationalization middleware for public routes
 * @param {NextRequest} request - The request object
 * @returns {NextResponse} - The response object
 */
export function handleI18nMiddleware(
  request: NextRequest,
  isAuthenticated: boolean
): NextResponse {
  const { pathname } = request.nextUrl;

  if (!isAuthenticated) {
    // For root path, let intl middleware serve it as the default locale
    if (pathname === '/') {
      return intlMiddleware(request);
    }

    const splitPathnames = pathname.split('/');

    // Check for internationalized unauth only routes, such as `/en/login`
    if (
      splitPathnames.length > 2 &&
      unauthUnintlRoutes.includes(splitPathnames[2])
    ) {
      return NextResponse.redirect(
        new URL(`/${splitPathnames[2]}`, request.url)
      );
    }

    // For paths that already have a locale prefix, let intl middleware handle
    // them. /es/... is passed through unchanged. For /en/... (default locale
    // with an unnecessary prefix), intl middleware redirects to /... but does
    // not persist the locale via cookie — so we pin NEXT_LOCALE=en on the
    // redirect response to prevent the subsequent locale-detection pass from
    // re-routing the user to /es/... based on Accept-Language.
    if (SUPPORTED_LOCALES.includes(splitPathnames[1] as Locale)) {
      const explicitLocale = splitPathnames[1] as Locale;
      const response = intlMiddleware(request) as NextResponse;
      if (explicitLocale === routing.defaultLocale) {
        response.cookies.set('NEXT_LOCALE', explicitLocale, { path: '/' });
      }
      return response;
    }

    // Unauth routes, such as `/login`
    if (unauthUnintlRoutes.includes(splitPathnames[1])) {
      const response = NextResponse.next();
      response.headers.set('testing-location', pathname);
      return response;
    }

    // For paths without locale (like /about), detect preferred locale and
    // redirect non-default locales to /{locale}/path. For the default locale
    // (en), delegate to intl middleware which rewrites internally without
    // adding a /en/ prefix to the URL.
    const preferredLocale =
      request.cookies?.get('NEXT_LOCALE')?.value ||
      request.headers?.get('accept-language')?.split(',')[0]?.slice(0, 2) ||
      'en';
    const locale = SUPPORTED_LOCALES.includes(preferredLocale as Locale)
      ? preferredLocale
      : 'en';
    if (locale === 'en') {
      return intlMiddleware(request);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Ensure we have a proper NextResponse with headers and cookies
 * @param {NextResponse | Response} intlResponse - The response object
 * @returns {NextResponse} - The response object
 */
export function ensureNextResponse(
  intlResponse: NextResponse | Response
): NextResponse {
  const response =
    intlResponse instanceof NextResponse ? intlResponse : NextResponse.next();

  // Copy headers from intl response if it was a basic Response
  if (!(intlResponse instanceof NextResponse)) {
    // Handle case where intl middleware returns a basic Response
    if (
      intlResponse &&
      typeof intlResponse === 'object' &&
      'headers' in intlResponse
    ) {
      const basicResponse = intlResponse as Response;
      if (basicResponse.headers) {
        basicResponse.headers.forEach((value, key) => {
          response.headers.set(key, value);
        });
      }
    }
  }

  return response;
}
