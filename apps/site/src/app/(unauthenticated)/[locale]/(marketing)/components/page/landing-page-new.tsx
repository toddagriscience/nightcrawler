// Copyright © Todd Agriscience, Inc. All rights reserved.

import PageHeader from '@/components/common/page-header/page-header';
import SectionContent from '@/components/common/section-content/section-content';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import HeaderImg from '../../../../../../components/common/header-img/header-img';

/**
 * Landing page component
 * @returns {JSX.Element} - The landing page component
 */
export default function LandingPageNew() {
  const t = useTranslations('landing');

  return (
    <section className="flex flex-col items-center space-y-30">
      <PageHeader
        title={t('pageHeading.title')}
        subtitle={t('pageHeading.subtitle')}
        button={t('pageHeading.button')}
      />
      <HeaderImg
        src="/marketing/who-we-are-header.webp"
        alt={t('pageHeading.title')}
        wrapperClassName="h-[500px] lg:h-[630px]"
      />
      <SectionContent
        className="mx-auto w-full text-center [&>h2]:text-[28px]/[41px]"
        caption={t('sectionContent.section1.caption')}
        title={t('sectionContent.section1.title')}
      />
      <div className="flex flex-col items-center justify-center space-y-15">
        <h2 className="text-[48px]/[24px]">
          {t('sectionContent.explore.title')}
        </h2>
        <Button
          variant="outline"
          className="rounded-full border-[1px] border-[#848484] text-sm w-[168px] h-[47px]"
          size="lg"
        >
          {t('sectionContent.explore.button')}
        </Button>
      </div>
    </section>
  );
}
