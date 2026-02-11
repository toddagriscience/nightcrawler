// Copyright © Todd Agriscience, Inc. All rights reserved.

import { SmoothScroll } from '@/components/common';
import { Footer, Header } from '@/components/landing';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import '../../globals.css';


/**
 * Default layout for unauthenticated, non-locale pages
 * @param {React.ReactNode} children - The children of the default layout
 * @returns {React.ReactNode} - The default layout
 */
export default async function DefaultLayout({
  children,
}: {children: React.ReactNode;}) {
  const locale = (await getLocale()) ?? 'en';
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SmoothScroll>
          <Header />
            {children}
          <Footer />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
