// Copyright Todd LLC, All rights reserved.

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/common';
import { Card, CardContent } from '@/components/ui';
import { ScrollShrinkWrapper } from '@/components/landing';
import ValuesCard from './components/values-card';

/**
 * Who We Are page component
 * @returns {JSX.Element} - The who we are page
 */
export default function WhoWeArePage() {
  const t = useTranslations('whoWeAre');

  return (
    <>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Mission, Vision, and Values Section */}
      <ScrollShrinkWrapper>
        <div className="w-full rounded-2xl flex flex-col bg-secondary h-fit px-8 lg:px-16 py-16 lg:py-24">
          {/* Mission and Vision Cards Section */}
          <div className="mx-auto pb-4 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="relative p-8 md:p-14 lg:p-36">
                <CardContent className="p-0">
                  <h2 className="text-4xl xl:text-6xl font-light mb-12 lg:mb-20">
                    {t('mission.title')}
                  </h2>
                  <p className="text-base xl:text-xl font-light">
                    {t('mission.description')}
                  </p>
                </CardContent>
              </Card>
              <Card className="relative p-8 md:p-14 lg:p-36">
                <CardContent className="p-0">
                  <h2 className="text-4xl xl:text-6xl font-light mb-12 lg:mb-20">
                    {t('vision.title')}
                  </h2>
                  <p className="text-base xl:text-xl font-light">
                    {t('vision.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <ValuesCard />
        </div>
      </ScrollShrinkWrapper>
    </>
  );
}
