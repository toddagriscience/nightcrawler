// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata, Viewport } from 'next';
import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from '@/i18n/config';
import { env } from '@/lib/env';

import { FadeIn, SmoothScroll } from '@/components/common';
import { Footer, Header } from '@/components/landing';

/**
 * Generate metadata for each locale
 * @param {Promise<{ locale: string }>} params - The parameters for the function
 * @returns {Promise<Metadata>} - The metadata for the locale
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  // Location support (e.g., en_US, es_US) can be added here:
  // const ogLocale = locale === 'en' ? 'en_US' : 'es_US';
  const ogLocale = locale;

  return {
    title: {
      default: 'Todd United States',
      template: '%s | Todd United States',
    },
    description: t('description'),
    metadataBase: new URL(env.baseUrl),
    alternates: {
      canonical: `${env.baseUrl}/${locale}`,
      languages: Object.fromEntries([
        ...routing.locales.map((loc) => [loc, `${env.baseUrl}/${loc}`]),
        ['x-default', `${env.baseUrl}/${routing.defaultLocale}`],
      ]),
    },
    openGraph: {
      title: 'Todd | Global Leader in Sustainable Agriculture',
      description: t('description'),
      url: `${env.baseUrl}/${locale}`,
      siteName: 'Todd United States',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: 'https://www.toddagriscience.com/opengraph-image.png',
          width: 1300,
          height: 740,
          type: 'image/png',
          alt: 'Todd United States',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ToddAgriscience',
      title: 'Todd | Global Leader in Sustainable Agriculture',
      description: t('description'),
      images: ['https://www.toddagriscience.com/opengraph-image.png'],
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
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FDFDFB',
};

// Generate static params for all supported locales
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Locale layout for the app
 *
 * @param {React.ReactNode} children - The children of the locale layout
 * @param {Promise<{ locale: string }>} params - The parameters for the function
 * @returns {React.ReactNode} - The locale layout
 */
export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale - if invalid, trigger 404 regardless of auth status
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        <Header />
        <FadeIn>{children}</FadeIn>
        <Footer />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
