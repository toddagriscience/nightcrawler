// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import { handleAuthRouting } from './proxy/auth';

/**
 * Proxy for the internal dashboard.
 * Every route except `/login` requires both a valid Supabase session
 * and an active internal account. Users without an internal account
 * are redirected to `/login`.
 *
 * @param request - The incoming request
 * @returns The response, possibly a redirect to /login
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { response, isAuthenticated, hasInternalAccount } =
    await handleAuthRouting(request);

  if (pathname === '/login') {
    // Already fully authorised → skip the login page
    if (isAuthenticated && hasInternalAccount) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // Protected routes require both Supabase auth AND an internal account
  if (!isAuthenticated || !hasInternalAccount) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
