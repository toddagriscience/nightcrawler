// Copyright Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
import { Locale } from 'next-intl';
import { NextRequest, NextResponse } from 'next/server';

/** Any protected URLs */
const protectedUrls = ['/dashboard'];

/**
 * Handle authentication-based routing. If the user is:
 * - Authenticated and navigating to a protected un-internationalized route: Allow them through
 * - Authenticated and navigating to a protected internationalized route: Redirect to an un-internationalized route, and allow them through
 * - Authenticated and navigating to an unprotected route: Allow them through
 * - Unauthenticated and navigating to a protected route (either internationalized or un-internationalized): Redirect them to `/login`
 * - Unauthenticated and navigating to an unprotected route: Allow them through
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

  // Authenticated users accessing protected routes should be let through, but no one else
  if (isAuthenticated) {
    if (isRouteProtected(pathname)) {
      return NextResponse.next();
    }

    // If user accidentally tried to go to the dashboard with a URL like `/en/dashboard`, handle that accordingly.
    if (isIntlRouteProtected(pathname)) {
      const urlSplit = pathname.split('/');
      const urlLocaleRemoved = `/${urlSplit.slice(2).join('/')}`;
      return NextResponse.redirect(new URL(urlLocaleRemoved, request.url));
    }
  }

  if (
    !isAuthenticated &&
    (isRouteProtected(pathname) || isIntlRouteProtected(pathname))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
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
      return pathname.startsWith(url);
    })
    .some((val) => val);
}

/** Helper function to check for routes such as `/en/dashboard/` or `/es/dashboard/something-important`. Note that `nightcrawler` as a whole does not internationalize protected routes, so this is a *helpful* feature, not one critical to the application.
 *
 * @param pathname The entire path, from request.nextUrl.pathname
 * @returns Whether the route meets the given criteria for an internationalized protected route
 */
function isIntlRouteProtected(pathname: string) {
  const urlSplit = pathname.split('/');

  return (
    urlSplit.length >= 3 &&
    routing.locales.includes(urlSplit[1] as Locale) &&
    isRouteProtected(`/${urlSplit[2]}`)
  );
}
