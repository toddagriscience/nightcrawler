// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn, SmoothScroll } from '@/components/common';
import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';
import { Footer, Header } from '@/components/landing';
import { Link } from '@/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });
  const messages = await getMessages({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SmoothScroll>
        <div
          className={`w-screen min-h-screen flex flex-col ${
            user ? 'bg-background-platform' : 'bg-background'
          }`}
        >
          {user ? <AuthenticatedHeader /> : <Header />}
          <FadeIn>
            <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
              {' '}
              <h1 className="mb-8 text-4xl text-center">
                {t('notFound.title')}
              </h1>
              <p className="text-center">
                {t.rich('notFound.message', {
                  home: (chunks) => (
                    <Link
                      href="/"
                      className="underline underline-offset-4 hover:opacity-80"
                    >
                      {chunks}
                    </Link>
                  ),
                  news: (chunks) => (
                    <Link
                      href="/news"
                      className="underline underline-offset-4 hover:opacity-80"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </FadeIn>
          <Footer />
        </div>
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
