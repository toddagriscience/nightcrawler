// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PageHero } from '@/components/common';
import { Disclaimer } from '@/components/common/disclaimer/disclaimer';
import HeaderImg from '@/components/common/header-img/header-img';
import { Card, CardContent } from '@/components/ui';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import ValuesCard from './components/values-card';

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
        src="/meadow-2.webp"
        alt="Meadow"
        overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
      />
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <div className="w-full mb-32 flex flex-col bg-secondary h-fit px-8 lg:px-16 py-16 lg:py-24">
        <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
          <div className="flex lg:flex-row flex-col flex-wrap gap-4">
            <Card className="lg:max-w-110">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <h2 className="text-4xl font-light md:mb-6 mb-4 lg:mb-14">
                  {t('mission.title')}
                </h2>
                <p className="md:text-lg text-base font-light">
                  {t('mission.description')}
                </p>
              </CardContent>
            </Card>
            <Card className="lg:max-w-110">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <h2 className="text-4xl font-light md:mb-6 mb-4 lg:mb-14">
                  {t('vision.title')}
                </h2>
                <p className="md:text-lg text-base font-light">
                  {t('vision.description')}
                </p>
              </CardContent>
            </Card>
          </div>
          <ValuesCard />
        </div>
      </div>
      <Disclaimer translationLoc="whoWeAre.disclaimers" disclaimerCount={7} />
    </>
  );
}
