//Copyright Todd LLC, All rights reserved.

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDown } from 'lucide-react';

/**
 * Hero component
 * @returns {JSX.Element} - The hero component
 */
const Hero = () => {
  const t = useTranslations('homepage');

  return (
    <div className="text-center justify-end mx-auto flex flex-col items-center h-[97vh] pb-32">
      <h3 className="text-2xl lg:text-4xl font-light max-w-lg my-5 select-none pointer-events-none">
        {t('hero.tagline')}
      </h3>
      <span>
        <ArrowDown className="text-foreground" />
      </span>
    </div>
  );
};

export default Hero;
