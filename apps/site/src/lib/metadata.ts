// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata, Viewport } from 'next';

/**
 * Site configuration
 * @returns {const} - The site configuration
 */
const siteConfig = {
  name: 'Todd United States',
  title: 'Todd United States',
  description:
    'Todd Agriscience is a first-generation generative agriculture firm.',
  url: 'https://www.toddagriscience.com',
  ogImage: 'https://www.toddagriscience.com/opengraph-image.png',
  twitterImage: 'https://www.toddagriscience.com/opengraph-image.png',
  linkedinImage: 'https://www.toddagriscience.com/opengraph-image.png',
  themeColor: '#FDFDFB',
  social: {
    twitter: '@toddagriscience',
  },
} as const;

/**
 * Default metadata for the site
 * @returns {Metadata} - The default metadata
 */
export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  // Next.js automatically detects icons in /app directory
  // Files detected: favicon.ico, icon.png, apple-touch-icon.png, opengraph-image.png
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Todd United States',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.twitterImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  manifest: '/site.webmanifest',
};

/**
 * Default viewport configuration
 * @returns {Viewport} - The default viewport
 */
export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: siteConfig.themeColor,
};

/**
 * Get the title suffix based on the path
 * @param {string} path - The path of the page
 * @returns {string} - The title suffix
 */
function getTitleSuffix(path: string): string {
  if (path.includes('/investors')) {
    return 'Todd Investors';
  }
  return 'Todd United States';
}

/**
 * Utility function to create page-specific metadata
 * @param {Object} props - The component props
 * @param {string} props.title - The title of the page
 * @param {string} props.description - The description of the page
 * @param {string} props.path - The path of the page
 * @param {string} props.ogImage - The og image of the page
 * @returns {Metadata} - The page metadata
 */
export function createMetadata({
  title,
  description,
  path = '',
  ogImage,
}: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const pageUrl = `${siteConfig.url}${path}`;
  const titleSuffix = getTitleSuffix(path);
  const fullTitle = title ? `${title} | ${titleSuffix}` : titleSuffix;

  return {
    title,
    description: description || siteConfig.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: fullTitle,
      description: description || siteConfig.description,
      url: pageUrl,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title || siteConfig.title,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: fullTitle,
      description: description || siteConfig.description,
      images: ogImage ? [ogImage] : defaultMetadata.twitter?.images,
    },
  };
}

export { siteConfig };
