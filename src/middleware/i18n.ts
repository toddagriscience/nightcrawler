// Copyright Todd Agriscience, Inc. All rights reserved.

import { routing, SUPPORTED_LOCALES } from '@/i18n/config';
import { Locale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @constant {Array.<string>}
 *
 * A collection of routes that are not to be handled with intl middleware. */
const unIntlRoutes = ['/', '/login'];

/**
 * Next-intl middleware instance
 * @returns {createMiddleware} - The next-intl middleware instance
 */
export const intlMiddleware = createMiddleware(routing);

/**
 * Handle internationalization middleware for public routes
 * @param {NextRequest} request - The request object
 * @param {boolean} isAuthenticated - The authentication status
 * @returns {NextResponse} - The response object
 */
export function handleI18nMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // If route is uninternationalized, don't touch it
  if (
    unIntlRoutes
      .map((url) => {
        if (pathname.length > 1 && url === '/') {
          return false;
        }

        return pathname.startsWith(url);
      })
      .some((val) => val)
  ) {
    return NextResponse.next();
  }

  // For paths that already have locale, let them through normally
  if (SUPPORTED_LOCALES.includes(pathname.split('/')[1] as Locale)) {
    return NextResponse.next();
  }

  // For paths without locale (like /who-we-are, /no-page-here),
  // manually redirect to /en/{path} to preserve the exact path
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.redirect(url);
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
