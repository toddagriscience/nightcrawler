import createMiddleware from 'next-intl/middleware';
import { env, type DomainConfig } from '@/lib/env';

// Get domains from environment configuration
const getDomains = (): DomainConfig[] => {
  const domains: DomainConfig[] = [];

  // Production domain
  if (env.productionDomain) {
    domains.push({
      domain: env.productionDomain,
      defaultLocale: env.defaultLocale,
      locales: [...env.supportedLocales],
    });
  }

  // Development domain
  if (env.isDevelopment) {
    domains.push({
      domain: env.developmentDomain,
      defaultLocale: env.defaultLocale,
      locales: [...env.supportedLocales],
    });
  }

  // Staging domain (optional)
  if (env.stagingDomain) {
    domains.push({
      domain: env.stagingDomain,
      defaultLocale: env.defaultLocale,
      locales: [...env.supportedLocales],
    });
  }

  return domains;
};

const intlMiddleware = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always' as const,
  localeDetection: !env.isDevelopment, // Disable auto-detection in dev
  domains: getDomains(),
});

export default intlMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
