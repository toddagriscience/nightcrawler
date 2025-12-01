// Copyright (c) Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
import { Locale } from 'next-intl';
import { NextRequest, NextResponse } from 'next/server';

/** Any protected URLs */
const protectedUrls = ['/'];

/**
 * Handle authentication-based routing. If the user is:
 * - Authenticated and navigating to a protected route: Allow them through
 * - Authenticated and navigating to a non-protected route (marketing site route): Redirect to protected route '/'
 * - Unauthenticated and navigating to a protected route: Redirect to `/en` (marketing site landing page)
 * - Unauthenticated and navigating to a non-protected route (marketing site route): Allow them through
 *
 * Note that the "dashboard" is located at '/' and is consequently uninternationalized. The marketing site is the only piece of the site that is internationalized.
 *
 * Routes with no internationalization, ex. `/somewhere`, are treated as protected routes, and in the given example, will redirect to `/en` + `/somewhere` for unauthenticated users. HOWEVER, this is handled by other pieces of middleware.
 *
 * @param {NextRequest} request - The request object
 * @param {boolean} isAuthenticated - The authentication status
 * @returns {NextResponse | null} - The response object
 */
export function handleAuthRouting(
  request: NextRequest,
  isAuthenticated: boolean
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (isRouteProtected(pathname)) {
    if (isAuthenticated) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/en', request.url));
  } else {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return null;
}

/**
 * Helper function to check for protected routes as seen in `protectedUrls`.
 *
 * @param pathname The entire path, from request.nextUrl.pathname
 * @returns Whether the route meets the given criteria for an internationalized protectedRoute
 * */
function isRouteProtected(pathname: string) {
  return protectedUrls
    .map((url) => {
      // Handle '/' appropriately
      if (pathname.length > 1 && url === '/') {
        return false;
      }
      return pathname.startsWith(url);
    })
    .some((val) => val);
}
