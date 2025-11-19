// Copyright Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import {
  applyPrivacyControls,
  ensureNextResponse,
  handleAuthRouting,
  handleI18nMiddleware,
  hasGPCEnabled,
} from './middleware/export';
import { checkAuthenticated } from './lib/auth';

/**
 * Middleware for internationalization, authentication, and privacy controls
 * Handles Global Privacy Control (GPC) signals and privacy preferences
 * @param {NextRequest} request - The request object
 * @returns {NextResponse} - The response object
 */
export default async function middleware(request: NextRequest) {
  // Check for Global Privacy Control (GPC) signal
  const gpcEnabled = hasGPCEnabled(request);

  const isAuthenticated = await checkAuthenticated();

  // Handle authentication-based routing
  const authRedirect = handleAuthRouting(request, isAuthenticated);
  if (authRedirect) {
    return authRedirect;
  }

  // For authenticated users, skip i18n middleware entirely and let Next.js handle routing naturally
  if (isAuthenticated) {
    const response = NextResponse.next();
    return applyPrivacyControls(request, response, gpcEnabled);
  }

  // Run the internationalization middleware for unauthenticated users only
  const intlResponse = handleI18nMiddleware(request, isAuthenticated);

  // Ensure we have a NextResponse with proper headers and cookies properties
  const response = ensureNextResponse(intlResponse);

  // Apply privacy controls based on GPC status
  return applyPrivacyControls(request, response, gpcEnabled);
}

export const config = {
  // Match all routes except Next.js internals, API routes, and static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - Any file with extension (like .jpg, .png, .js, .css, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};
