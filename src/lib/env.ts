// Environment configuration for internationalization and domains
export const env = {
  // Production domain
  productionDomain:
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'toddagriscience.com',

  // Staging domain (optional)
  stagingDomain: process.env.NEXT_PUBLIC_STAGING_DOMAIN,

  // Development domain
  developmentDomain: 'localhost',

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Locale configuration
  defaultLocale: 'en' as const,
  supportedLocales: ['en', 'es'] as const,

  // Base URL for canonical links and metadata
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'toddagriscience.com'}`),
} as const;

// Type for supported locales
export type SupportedLocale = (typeof env.supportedLocales)[number];

// Type for domain configuration
export interface DomainConfig {
  domain: string;
  defaultLocale: SupportedLocale;
  locales: SupportedLocale[];
}
