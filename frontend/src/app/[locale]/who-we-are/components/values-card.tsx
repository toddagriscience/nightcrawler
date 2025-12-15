// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui';

/**
 * Values card component that displays the company values as a single card
 * @returns {JSX.Element} - The values card component
 */
const ValuesCard = () => {
  const t = useTranslations('whoWeAre.values');

  const valuesSections = [
    {
      title: t('personalValues.title'),
      items: [
        'kindnessRespectIntegrity',
        'humility',
        'transparency',
        'giveBack',
      ].map((key) => ({
        title: t(`personalValues.${key}.title`),
        description: t(`personalValues.${key}.description`),
      })),
    },
    {
      title: t('professionalValues.title'),
      items: [
        'drivenByExcellence',
        'clientFocused',
        'creative',
        'missionDriven',
      ].map((key) => ({
        title: t(`professionalValues.${key}.title`),
        description: t(`professionalValues.${key}.description`),
      })),
    },
    {
      title: t('ourCulture.title'),
      items: ['teamFirst', 'inclusivity', 'diversity', 'talentDevelopment'].map(
        (key) => ({
          title: t(`ourCulture.${key}.title`),
          description: t(`ourCulture.${key}.description`),
        })
      ),
    },
  ];

  const valuesContent = (
    <div>
      <h2 className="text-4xl xl:text-6xl mb-0 xl:mb-36 font-light">Values</h2>

      <div className="hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-[180px]">
        {valuesSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex flex-col">
            <div className="h-full flex flex-col gap-16 md:gap-20">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="min-h-[140px]">
                  <h4 className="text-foreground mb-6 text-xl md:text-2xl font-light">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground leading-7 text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="xl:hidden">
        <div className="space-y-12 mt-16">
          {valuesSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-8">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <h4 className="text-lg md:text-xl font-light mb-3">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="relative p-8 md:p-14 lg:p-36">
        <CardContent className="p-0">{valuesContent}</CardContent>
      </Card>
    </div>
  );
};

export default ValuesCard;
