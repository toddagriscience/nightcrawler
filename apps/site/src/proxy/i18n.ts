// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing, SUPPORTED_LOCALES } from '@/i18n/config';
import { Locale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

/** Routes that are uninternationalized and only accessible to the public */
const unauthUnintlRoutes = [
  'incoming',
  'auth',
  'externship-terms',
  // Only for go.toddagriscience.com
  'invite',
  'creators',
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
  if (isAuthenticated) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const splitPathnames = pathname.split('/');

  // Locale-prefixed unauth routes, such as `/es/incoming` → `/incoming`
  if (
    splitPathnames.length > 2 &&
    SUPPORTED_LOCALES.includes(splitPathnames[1] as Locale) &&
    unauthUnintlRoutes.includes(splitPathnames[2])
  ) {
    return NextResponse.redirect(new URL(`/${splitPathnames[2]}`, request.url));
  }

  // Unauth routes at the root, such as `/incoming`
  if (unauthUnintlRoutes.includes(splitPathnames[1])) {
    const response = NextResponse.next();
    response.headers.set('testing-location', pathname);
    return response;
  }

  return intlMiddleware(request);
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
