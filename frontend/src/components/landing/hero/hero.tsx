// Copyright © Todd Agriscience, Inc. All rights reserved.

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
    <div className="text-center justify-center mx-auto flex flex-col items-center h-[40vh]">
      <h3 className="text-3xl lg:text-4xl font-light my-5 select-none pointer-events-none">
        {t('hero.tagline')}
      </h3>
    </div>
  );
};

export default Hero;
