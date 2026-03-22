// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Environment configuration
 * @returns {const} - The environment configuration
 */
export const env = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Base URL for canonical links and metadata
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'toddagriscience.com'}`),
} as const;
