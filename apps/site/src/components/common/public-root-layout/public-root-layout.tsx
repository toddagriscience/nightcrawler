// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ThemeReset } from '@/components/common';
import { SOCIAL_PROFILES } from '@/components/common/social-links/social-profiles';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/context/theme/theme-context';
import { fontVariables } from '@/lib/fonts';
import { siteConfig } from '@/lib/metadata';
import { Organization, WebSite, WithContext } from 'schema-dts';
import '@/app/globals.css';
import { PostHogProvider } from '@/app/providers';

const webSiteStructuredData: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Todd',
  url: 'https://toddagriscience.com/',
  alternateName: ['Todd'],
};

const organizationStructuredData: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://toddagriscience.com',
  sameAs: [
    'https://www.toddagriscience.com',
    SOCIAL_PROFILES.linkedin.href,
    SOCIAL_PROFILES.x.href,
  ],
  logo: 'https://toddagriscience.com/icon.png',
  name: 'Todd',
  description: siteConfig.description,
  founder: {
    '@type': 'Person',
    name: 'Vincent Todd',
  },
  foundingDate: '2018',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
  },
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: 36,
  },
};

/**
 * Root layout for the app
 * @param {React.ReactNode} children - The children of the root layout
 * @returns {React.ReactNode} - The root layout
 */
export default function PublicRootLayout({
  children,
  locale = 'en',
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  return (
    <html lang={locale === 'es' ? 'es' : 'en'}>
      {/* eslint-disable-next-line @next/next/no-head-element -- The Metadata API cannot emit native JSON-LD script tags. */}
      <head>
        {/** JSON-LD is static site data; keep it in the crawler-visible head. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteStructuredData).replace(
              /</g,
              '\\u003c'
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData).replace(
              /</g,
              '\\u003c'
            ),
          }}
        />
      </head>
      <body className={fontVariables}>
        <PostHogProvider>
          <ThemeProvider>
            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
              <ThemeReset />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
