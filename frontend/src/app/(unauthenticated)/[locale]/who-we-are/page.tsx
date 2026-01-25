// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { Metadata } from 'next';
import Image from 'next/image';
import HeaderImage from '@/../public/marketing/who-we-are-header.png';
import People1 from '@/../public/marketing/who-we-are-people.png';
import People2 from '@/../public/marketing/who-we-are-people-2.png';
import { Link } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Who We Are',
};

/**
 * Who We Are page component
 * @returns {JSX.Element} - The who we are page
 */
export default function WhoWeArePage() {
  const t = useTranslations('whoWeAre');

  const introParagraphs = t.raw('intro.paragraphs') as string[];
  const competencies = t.raw('competencies.items') as string[];

  return (
    <div className="flex flex-col justify-center items-center gap-16 mt-12 max-w-250 w-[90vw] mx-auto">
      <div>
        <Image src={HeaderImage} alt="" />
      </div>

      <div className="space-y-8">
        <h1 className="text-left text-3xl md:text-4xl">{t('title')}</h1>

        <div className="font-light space-y-4">
          {introParagraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
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

      <div className="flex flex-row flex-wrap gap-4 my-12 items-center justify-center">
        <Image src={People1} alt="" className="max-w-100" />
        <Image src={People2} alt="" className="max-w-120" />
      </div>

      <div className="space-y-16">
        <h2 className="text-2xl md:text-3xl">{t('competencies.title')}</h2>

        <div className="font-light flex flex-col justify-center items-center gap-16">
          {competencies.map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      </div>

      <Button variant="ghost" className="mx-auto text-3xl my-32">
        <Link href="/what-we-do">{t('navigation.whatWeDo')}</Link>
      </Button>
    </div>
  );
}
