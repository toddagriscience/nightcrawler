// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { PageHero } from '@/components/common';
import { ScrollShrinkWrapper } from '@/components/landing';
import { useTranslations } from 'next-intl';

/**
 * ESGPage component renders the Environmental, Social, and Governance (ESG) information page.
 * @returns {JSX.Element} The rendered ESG page content.
 */
export default function ESGPage() {
  const t = useTranslations('esg');

  return (
    <>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Content Section */}
      <ScrollShrinkWrapper>
        <div className="w-full rounded-2xl flex flex-col bg-secondary h-fit px-8 lg:px-16 py-16 lg:py-24">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl xl:text-6xl font-light mb-8">
                {t('heading')}
              </h2>
              <p className="text-base xl:text-xl font-light text-muted-foreground max-w-3xl mx-auto">
                {t('description')}
              </p>
            </div>
          </div>
        </div>
      </ScrollShrinkWrapper>
    </>
  );
}
