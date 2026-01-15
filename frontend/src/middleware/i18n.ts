// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing, SUPPORTED_LOCALES } from '@/i18n/config';
import { Locale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

/** Routes that are uninternationalized and only accessible to the public */
const unauthUnintlRoutes = ['login', 'forgot-password', 'incoming'];

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
    // For root path, use intl middleware (it will redirect / to /en)
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

    // For paths that already have locale, let them through normally
    if (SUPPORTED_LOCALES.includes(splitPathnames[1] as Locale)) {
      return NextResponse.next();
    }

    // Unauth routes, such as `/login`
    if (unauthUnintlRoutes.includes(splitPathnames[1])) {
      const response = NextResponse.next();
      response.headers.set('testing-location', pathname);
      return response;
    }

    // For paths without locale (like /who-we-are, /no-page-here),
    // manually redirect to /en/{path} to preserve the exact path
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
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
