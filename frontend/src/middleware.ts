// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import {
  applyPrivacyControls,
  ensureNextResponse,
  handleI18nMiddleware,
  hasGPCEnabled,
} from './middleware/export';
import { handleAuthRouting } from './middleware/auth';
import isAllUserRoute from './middleware/all-users-page';
import { permanentRedirect } from 'next/navigation';
import specialRedirect from './middleware/special-redirect';

/**
 * Middleware for internationalization, authorization, and privacy controls
 * Handles Global Privacy Control (GPC) signals and privacy preferences
 * @param {NextRequest} request - The request object
 * @returns {NextResponse} - The response object
 */
export default async function middleware(request: NextRequest) {
  const shouldSpecialRedirect = specialRedirect(request);

  if (shouldSpecialRedirect) {
    return shouldSpecialRedirect;
  }

  // Check for Global Privacy Control (GPC) signal
  const gpcEnabled = hasGPCEnabled(request);

  const canAllAccess = await isAllUserRoute(request);

  // Handle authentication-based routing
  if (!canAllAccess) {
    const authRedirect = await handleAuthRouting(request);
    if (authRedirect) {
      return authRedirect;
    }
  }

  // Run the internationalization middleware for unauthenticated users only
  const intlResponse = handleI18nMiddleware(request, false);

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
