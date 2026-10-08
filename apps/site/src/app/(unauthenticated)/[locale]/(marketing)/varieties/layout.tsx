// Copyright © Todd Agriscience, Inc. All rights reserved.

import { env } from '@/lib/env';
import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

/**
 * Metadata for **`/{locale}/varieties`** (public variety list).
 *
 * @param params - Route params with locale
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTranslations({ locale, namespace: 'varieties.metadata' });

  return {
    metadataBase: new URL(env.baseUrl),
    title: {
      absolute: `${t('shortTitle')} | ${siteConfig.name}`,
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${env.baseUrl}/${locale}/varieties`,
      siteName: siteConfig.name,
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social.twitter,
      title: t('title'),
      description: t('description'),
    },
  };
}

/**
 * Passthrough layout for the **`/varieties`** subtree.
 *
 * @param props - Layout children slot
 */
export default function VarietiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
