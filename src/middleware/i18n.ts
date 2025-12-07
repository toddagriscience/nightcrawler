// Copyright Todd Agriscience, Inc. All rights reserved.

import { routing, SUPPORTED_LOCALES } from '@/i18n/config';
import { Locale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import applyNonce from './nonce';

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

  const defaultResponse = applyNonce(request);

  if (!isAuthenticated) {
    // For root path, use intl middleware (it will redirect / to /en)
    if (pathname === '/') {
      return intlMiddleware(request);
    }

    // For paths that already have locale, let them through normally
    if (SUPPORTED_LOCALES.includes(pathname.split('/')[1] as Locale)) {
      return defaultResponse;
    }

    // For paths without locale (like /who-we-are, /no-page-here),
    // manually redirect to /en/{path} to preserve the exact path
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return defaultResponse;
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
