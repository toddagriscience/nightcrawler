// Copyright © Todd Agriscience, Inc. All rights reserved.

import { env } from '@/lib/env';
import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

/**
 * Metadata for **`/{locale}/careers/search`** (job listings).
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
    metadataBase: new URL(env.baseUrl),
    title: {
      absolute: `${t('shortTitle')} | ${siteConfig.name}`,
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${env.baseUrl}/${locale}/careers/search`,
      siteName: siteConfig.name,
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
 * Passthrough layout for the careers **`/search`** subtree.
 *
 * @param props - Layout children slot
 */
export default function CareersSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
