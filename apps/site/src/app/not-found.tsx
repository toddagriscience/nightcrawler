// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Suspense } from 'react';
import { FadeIn, SmoothScroll } from '@/components/common';
import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';
import Button from '@/components/common/button/button';
import UnauthenticatedHeader from '@/components/common/unauthenticated-header/unauthenticated-header';
import { Link } from '@/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import SocialLinks from '@/components/common/social-links/social-links';

/**
 * Async server component that fetches locale data and auth state.
 * Kept inside a Suspense boundary so uncached request-time calls
 * (`getLocale`, `cookies`) do not block prerendering.
 *
 * @returns The full not-found page content with the correct header
 */
async function NotFoundContent() {
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
        {user ? <AuthenticatedHeader /> : <UnauthenticatedHeader />}
        <FadeIn>
          <div className="flex flex-col items-center justify-end max-w-[1200px] mx-auto lg:mt-20">
            <div className="flex lg:flex-row flex-col justify-center lg:items-end items-center gap-20 lg:gap-12 lg:mb-42 mb-20">
              <div className="flex flex-col items-start justify-end gap-8 max-w-[500px]">
                <h1 className="md:text-[300px] text-[170px] font-light leading-tight transform -translate-y-[-64px]">
                  {t('notFound.title')}
                </h1>
              </div>
              <div className="flex flex-col items-center lg:items-start justify-end gap-8 max-w-[500px]">
                <p className="text-lg md:text-xl text-center lg:text-left font-light leading-relaxed md:w-full max-w-[300px]">
                  {t('notFound.message')}
                </p>
                <Button
                  href="/"
                  text={t('notFound.homeButton')}
                  size="md"
                  showArrow={true}
                  variant="default"
                  className="font-light w-[154px]"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <SocialLinks
                platforms={['instagram', 'linkedin', 'x', 'youtube']}
              />
            </div>
          </div>
        </FadeIn>
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}

/**
 * Root not-found page rendered for any unmatched route.
 * All request-time data access (locale, cookies) is wrapped in Suspense
 * so the page can be prerendered without blocking.
 *
 * @returns The 404 page with Suspense-wrapped content
 */
export default function NotFound() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  );
}
