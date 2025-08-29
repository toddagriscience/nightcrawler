// Copyright Todd LLC, All rights reserved.
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

/**
 * Middleware for internationalization
 * @returns {Middleware} - The middleware
 */
export default createMiddleware(routing);

/**
 * Configuration object for the middleware.
 * Contains the `matcher` property to specify which routes the middleware applies to.
 */

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|es)/:path*'],
};
