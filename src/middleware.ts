// Copyright Todd LLC, All rights reserved.
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

/**
 * Middleware for internationalization
 * @returns {Middleware} - The middleware
 */
export default createMiddleware(routing);

/**
 * Configuration for middleware
 * @returns {Matcher} - The configuration for middleware
 */

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|es)/:path*'],
};
