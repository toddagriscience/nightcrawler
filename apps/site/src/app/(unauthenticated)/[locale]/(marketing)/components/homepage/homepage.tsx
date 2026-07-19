// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import HeaderImg from '@/components/common/header-img/header-img';
import PageHeader from '@/components/common/page-header/page-header';
import SectionContent from '@/components/common/section-content/section-content';
import { Button } from '@/components/ui';
import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';

/**
 * Homepage component
 * @returns {JSX.Element} - The homepage component
 */
export default function Homepage() {
  const t = useTranslations('homepage');

  return (
    <section className="flex flex-col items-center space-y-15 w-[90%] sm:w-[80%] mx-auto">
      <PageHeader
        title={t('pageHeading.title')}
        subtitle={t('pageHeading.subtitle')}
        button={{
          href: '/research',
          text: t('pageHeading.button'),
          buttonClassName: 'w-[174px]',
        }}
      />
      <HeaderImg
        src="/marketing/garden-bed.svg"
        alt={t('pageHeading.title')}
        wrapperClassName="w-full h-[500px] lg:h-[630px] translate-y-[-59px] md:my-20"
      />
      <SectionContent
        className="mx-auto w-full text-center [&>h2]:text-[28px]/[41px]"
        caption={t('sectionContent.section1.caption')}
        title={t('sectionContent.section1.title')}
      />
      <div className="flex flex-col items-center justify-center space-y-15 my-44">
        <h2 className="text-3xl lg:text-5xl/[24px]">
          {t('sectionContent.explore.title')}
        </h2>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-[0.75px] border-[#848484] text-sm w-[168px] h-[47px]"
          size="lg"
        >
          <Link href="/research/index">
            {t('sectionContent.explore.button')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
