// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/config';
import HeaderImg from '@/components/common/header-img/header-img';

export const metadata: Metadata = {
  title: 'Who We Are',
};

/**
 * Who We Are page component
 * @returns {JSX.Element} - The who we are page
 */
export default function WhoWeArePage() {
  const t = useTranslations('whoWeAre');

  return (
    <>
      <HeaderImg
        src="/marketing/who-we-are-header.webp"
        alt="Meadow"
        overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
      />
      <div className="flex flex-col justify-center items-center gap-16 mt-12 max-w-250 w-[90vw] mx-auto">
        <div className="space-y-8">
          <h1 className="text-left text-3xl md:text-4xl">{t('title')}</h1>

          <div className="font-light space-y-4">
            <p>{t('intro.paragraphs.0')}</p>
            <p>{t('intro.paragraphs.1')}</p>
            <p>{t('intro.paragraphs.2')}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-32">
          <h2 className="text-2xl md:text-3xl flex flex-col text-nowrap">
            <span>{t('culture.heading.line1')}</span>
            <span>{t('culture.heading.line2')}</span>
          </h2>

          <div className="flex flex-col font-light gap-4">
            <p>{t('culture.description')}</p>

            <Button
              variant="outline"
              className="rounded-4xl py-5 px-10 max-w-[200px] mx-auto"
            >
              <Link href="/careers">{t('culture.cta.careers')}</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-4 my-12 w-[90vw] md:w-auto items-center justify-center mx-auto">
          <Image
            src={'/marketing/who-we-are-people.png'}
            alt=""
            height={500}
            width={400}
          />
          <Image
            src={'/marketing/who-we-are-people-2.png'}
            alt=""
            height={500}
            width={400}
          />
        </div>

        <div className="space-y-16">
          <h2 className="text-2xl md:text-3xl">{t('competencies.title')}</h2>

          <div className="font-light flex flex-col justify-center items-center gap-16">
            <p>{t('competencies.items.0')}</p>
            <p>{t('competencies.items.1')}</p>
            <p>{t('competencies.items.2')}</p>
          </div>
        </div>

        <Button variant="ghost" className="mx-auto text-3xl my-32">
          <Link href="/what-we-do">{t('navigation.whatWeDo')}</Link>
        </Button>
      </div>
    </>
  );
}
