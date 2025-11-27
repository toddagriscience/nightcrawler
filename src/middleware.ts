// Copyright Todd Agriscience, Inc. All rights reserved.

import { NextRequest } from 'next/server';
import {
  applyPrivacyControls,
  ensureNextResponse,
  handleI18nMiddleware,
  hasGPCEnabled,
} from './middleware/export';

/**
 * Middleware for internationalization and privacy controls
 * Handles Global Privacy Control (GPC) signals and privacy preferences
 * @param {NextRequest} request - The request object
 * @returns {NextResponse} - The response object
 */
export default async function middleware(request: NextRequest) {
  // Check for Global Privacy Control (GPC) signal
  const gpcEnabled = hasGPCEnabled(request);

  // Run the internationalization middleware for ALL users, both authenticated and unauthenticated
  const intlResponse = handleI18nMiddleware(request);

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
