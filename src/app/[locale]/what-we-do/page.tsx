// Copyright Todd Agriscience, Inc. All rights reserved.

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/common';
import { Card, CardContent } from '@/components/ui';
import { ScrollShrinkWrapper } from '@/components/landing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What We Do',
};

/**
 * What We Do page component
 * @returns {JSX.Element} - The what we do page
 */
export default function WhatWeDoPage() {
  const t = useTranslations('whatWeDo');

  return (
    <>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Main Content Section */}
      <ScrollShrinkWrapper>
        <div className="w-full rounded-2xl flex flex-col bg-secondary h-fit px-8 lg:px-16 py-16 lg:py-24">
          {/* Approach Section */}
          <div className="mx-auto pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Card className="relative p-8 md:p-14 lg:p-24">
              <CardContent className="p-0 h-full flex flex-col justify-center">
                <h2 className="text-3xl xl:text-5xl font-light mb-8 lg:mb-12">
                  {t('approach.title')}
                </h2>
                <p className="text-base xl:text-xl font-light leading-relaxed">
                  {t('approach.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <div className="mx-auto pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl xl:text-5xl font-light mb-8 lg:mb-12 text-center">
              {t('services.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('services.strategicPartnerships.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('services.strategicPartnerships.description')}
                  </p>
                </CardContent>
              </Card>
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('services.operationalExpertise.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('services.operationalExpertise.description')}
                  </p>
                </CardContent>
              </Card>
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('services.marketLeadership.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('services.marketLeadership.description')}
                  </p>
                </CardContent>
              </Card>
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('services.sustainableGrowth.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('services.sustainableGrowth.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Focus Areas Section */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl xl:text-5xl font-light mb-8 lg:mb-12 text-center">
              {t('focus.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('focus.regenerativeAgriculture.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('focus.regenerativeAgriculture.description')}
                  </p>
                </CardContent>
              </Card>
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('focus.organicBiodynamic.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('focus.organicBiodynamic.description')}
                  </p>
                </CardContent>
              </Card>
              <Card className="relative p-8 md:p-10 lg:p-12">
                <CardContent className="p-0 h-full flex flex-col">
                  <h3 className="text-2xl xl:text-3xl font-light mb-6">
                    {t('focus.brandedFarms.title')}
                  </h3>
                  <p className="text-base xl:text-lg font-light leading-relaxed">
                    {t('focus.brandedFarms.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollShrinkWrapper>
    </>
  );
}
