// Copyright Todd LLC, All rights reserved.

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Routing configuration
 * @returns {Routing} - The routing configuration
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix
  localePrefix: 'always',

  // Enable locale detection in production, disable in development for easier testing
  localeDetection: process.env.NODE_ENV === 'production',
});

/**
 * Lightweight wrappers around Next.js' navigation APIs
 * that will consider the routing configuration
 * @returns {Navigation} - The navigation configuration
 */
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
