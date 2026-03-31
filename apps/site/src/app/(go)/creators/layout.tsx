// Copyright © Todd Agriscience, Inc. All rights reserved.

import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata({}: {}): Promise<Metadata> {
  return {
    metadataBase: new URL('https://go.toddagriscience.com'),
    title: {
      absolute: `Todd Creator Program | Todd United States`,
    },
    description: 'Help us make a impact on society.',
    openGraph: {
      title: 'Todd Creator Program',
      description: 'Help us make a impact on society.',
      url: `${env.baseUrl}/creators`,
      siteName: 'Todd Creator Program',
      type: 'website',
      images: [
        {
          url: '/creator-opengraph-image.png',
          width: 2796,
          height: 1460,
          type: 'image/png',
          alt: 'Todd - Creator Program.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ToddAgriscience',
      title: 'Todd Creator Program',
      description: 'Help us make a impact on society.',
      images: ['/creator-opengraph-image.png'],
    },
  };
}

/**
 * Layout for creators routes in the go subdomain
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The creators subdomain layout
 */
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
