// Copyright © Todd Agriscience, Inc. All rights reserved.

import { env } from '@/lib/env';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

/**
 * Metadata for careers listings — canonical URL `/careers/index` (rewritten here internally).
 *
 * @param params - Route params with locale
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTranslations({ locale, namespace: 'careers.metadata' });

  return {
    metadataBase: new URL('https://toddagriscience.com'),
    title: {
      absolute: `${t('shortTitle')} | Todd United States`,
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${env.baseUrl}/${locale}/careers/index`,
      siteName: 'Todd United States',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/career-opengraph-image.png',
          width: 2796,
          height: 1460,
          type: 'image/png',
          alt: 'Todd - Join Todd.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ToddAgriscience',
      title: t('title'),
      description: t('description'),
      images: ['/career-opengraph-image.png'],
    },
  };
}

/**
 * Passthrough layout for the careers listings subtree.
 *
 * @param props - Layout children slot
 */
export default function CareersListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
