// Copyright © Todd Agriscience, Inc. All rights reserved.

import { routing } from '@/i18n/config';
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
  const localizedUrls = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      new URL(
        `${loc === routing.defaultLocale ? '' : `/${loc}`}/varieties`,
        env.baseUrl
      ).toString(),
    ])
  );
  const pageUrl = localizedUrls[locale];

  return {
    metadataBase: new URL(env.baseUrl),
    title: {
      absolute: `${t('shortTitle')} | ${siteConfig.name}`,
    },
    description: t('description'),
    alternates: {
      canonical: pageUrl,
      languages: {
        ...localizedUrls,
        'x-default': localizedUrls[routing.defaultLocale],
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: pageUrl,
      siteName: siteConfig.name,
      locale: locale,
      type: 'website',
      images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social.twitter,
      title: t('title'),
      description: t('description'),
      images: [siteConfig.twitterImage],
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
