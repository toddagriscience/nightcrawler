// Copyright Todd LLC, All rights reserved.

import { routing } from '@/i18n/config';
import { logger } from '@/lib/logger';
import { Locale } from 'next-intl';
import { NextRequest, NextResponse } from 'next/server';

/**
 * The name of the authentication cookie
 * @constant {string} - The name of the authentication cookie
 */
export const AUTH_COOKIE_NAME = 'isAuth';

/**
 * Get authentication status from request cookies
 * @param {NextRequest} request - The request object
 * @returns {boolean} - The authentication status
 */
export function getAuthStatus(request: NextRequest): boolean {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  return authCookie?.value === 'true';
}

/**
 * Handle authentication-based routing
 * simple handler to redirect to the correct route based on the authentication status
 * will need to be updated later once backend is implemented
 * @param {NextRequest} request - The request object
 * @param {boolean} isAuthenticated - The authentication status
 * @returns {NextResponse | null} - The response object
 */
export function handleAuthRouting(
  request: NextRequest,
  isAuthenticated: boolean
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (isAuthenticated) {
    // Authenticated users accessing public routes should go to dashboard
    if (routing.locales.includes(pathname.split('/')[1] as Locale)) {
      logger.warn(
        `[Auth] Authenticated user accessing public route: ${pathname}, redirecting to dashboard`
      );
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    // Unauthenticated users accessing protected routes should go to landing
    if (pathname === '/') {
      logger.warn(
        `[Auth] Unauthenticated user accessing protected route: ${pathname}, redirecting to landing`
      );
      return NextResponse.redirect(
        new URL(`/${routing.defaultLocale}`, request.url)
      );
    }
  }

  return null;
}
