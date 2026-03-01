// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn, SmoothScroll } from '@/components/common';
import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';
import UnauthenticatedHeader from '@/components/common/unauthenticated-header/unauthenticated-header';
import Button from '@/components/common/button/button';
import { Link } from '@/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });
  const messages = await getMessages({ locale });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const socialMediaIcons = [
    {
      icon: <FaInstagram aria-hidden="true" />,
      href: 'https://www.instagram.com/toddagriscience/',
      ariaLabel: 'Visit our Instagram page',
    },
    {
      icon: <FaLinkedinIn aria-hidden="true" />,
      href: 'https://www.linkedin.com/company/toddagriscience/',
      ariaLabel: 'Visit our LinkedIn page',
    },
    {
      icon: <FaXTwitter aria-hidden="true" />,
      href: 'https://x.com/toddagriscience',
      ariaLabel: 'Visit our X (Twitter) page',
    },
    {
      icon: <FaYoutube aria-hidden="true" />,
      href: 'https://www.youtube.com/@toddagriscience',
      ariaLabel: 'Visit our YouTube channel',
    },
  ];

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
            <div className="flex flex-row flex-wrap gap-6">
          {socialMediaIcons.map((val) => (
            <Link key={val.href} href={val.href} aria-label={val.ariaLabel}>
              {val.icon}
            </Link>
          ))}
      
        </div>
          </div>
          </div>
        </FadeIn>
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
