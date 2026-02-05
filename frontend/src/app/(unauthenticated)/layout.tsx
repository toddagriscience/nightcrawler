// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ThemeReset } from '@/components/common';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/context/theme/ThemeContext';
import { fontVariables } from '@/lib/fonts';
import type { Metadata } from 'next';
import { Organization, WebSite, WithContext } from 'schema-dts';
import '../globals.css';
import { PostHogProvider } from '../providers';

/**
 * Root layout metadata for pages outside [locale] directory
 */
export const metadata: Metadata = {
  title: {
    default: 'Todd United States',
    template: '%s | Todd United States',
  },
};

const webSiteStructuredData: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Todd',
  url: 'https://toddagriscience.com/',
  alternateName: ['Todd Agriscience'],
};

const organizationStructuredData: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://toddagriscience.com',
  sameAs: [
    'https://www.toddagriscience.com',
    'https://toddagriculture.com',
    'https://www.linkedin.com/company/toddagriscience',
    'https://x.com/toddagriscience',
  ],
  logo: 'https://toddagriscience.com/icon.png',
  name: 'Todd',
  description:
    'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers.',
  founder: {
    '@type': 'Person',
    name: 'Vincent Todd',
  },
  foundingDate: '2018-06-01',
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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/** Do not dangerously set inner HTML for any user-inputted values. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
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
