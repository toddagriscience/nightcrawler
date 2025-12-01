// Copyright (c) Todd Agriscience, Inc. All rights reserved.

import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

/**
 * A list of all supported locales
 * @constant {string[]} - The list of supported locales
 */
export const SUPPORTED_LOCALES = ['en', 'es'];

/**
 * Routing configuration
 * @returns {Routing} - The routing configuration
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix
  localePrefix: 'always',

  // Enable locale detection in production, disable in development for easier testing
  localeDetection: process.env.NODE_ENV === 'production',

  // Don't redirect to 404 for unknown paths - let Next.js handle it
  alternateLinks: false,
});

/**
 * Lightweight wrappers around Next.js' navigation APIs
 * that will consider the routing configuration
 * @returns {Navigation} - The navigation configuration
 */
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
