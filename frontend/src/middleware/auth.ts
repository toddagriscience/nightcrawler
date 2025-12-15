// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPPORTED_LOCALES } from '@/lib/locales';
import { Locale } from 'next-intl';
import { isRouteInternationalized } from '@/lib/routing';

/** Any protected URLs */
const protectedUrls = ['/', '/account/reset-password'];

/**
 * Handle authentication-based routing. If the user is:
 * - Authenticated and navigating to a protected route: Allow them through
 * - Authenticated and navigating to a non-protected route (marketing site route): Redirect to protected route '/'
 * - Unauthenticated and navigating to a protected route: Redirect to `/en` (marketing site landing page)
 * - Unauthenticated and navigating to a non-protected route (marketing site route): Allow them through
 *
 * Note that the "dashboard" is located at '/' and is consequently uninternationalized. The marketing site is the only piece of the site that is internationalized.
 *
 * @param {NextRequest} request - The request object
 * @returns {NextResponse | null} - The response object
 */
export async function handleAuthRouting(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co`,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const { data } = await supabase.auth.getClaims();

  const isAuthenticated = data?.claims;

  if (isRouteProtected(pathname)) {
    if (isAuthenticated) {
      return supabaseResponse;
    }

    return NextResponse.redirect(new URL('/en', request.url));
  } else {
    if (isAuthenticated) {
      if (isRouteInternationalized(pathname)) {
        const response = NextResponse.redirect(new URL('/', request.url));
        supabaseResponse.cookies.getAll().map(({ name, value, ...options }) => {
          response.cookies.set(name, value, options);
        });
        return response;
      }
      const response = NextResponse.next();
      supabaseResponse.cookies.getAll().map(({ name, value, ...options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
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
