import type { Metadata, Viewport } from 'next';

// Site configuration
const siteConfig = {
  name: 'Todd',
  title: 'Todd',
  description:
    'Todd Agriscience is a first-generation generative agriculture firm.',
  url: 'https://www.toddagriscience.com',
  ogImage: 'https://www.toddagriscience.com/og-image.jpg',
  twitterImage: 'https://www.toddagriscience.com/twitter-card-image.jpg',
  themeColor: '#F8F5EE',
  social: {
    twitter: '@toddagriscience',
  },
} as const;

// Default metadata for the site
export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
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
        alt: 'Todd Agriscience',
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
};

// Default viewport configuration
export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: siteConfig.themeColor,
};

// Utility function to create page-specific metadata
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

  return {
    title,
    description: description || siteConfig.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || siteConfig.title,
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
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: ogImage ? [ogImage] : defaultMetadata.twitter?.images,
    },
  };
}

export { siteConfig };
