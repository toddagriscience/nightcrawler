// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useTranslations } from 'next-intl';

/**
 * Hero component
 * @returns {JSX.Element} - The hero component
 */
const Hero = () => {
  const t = useTranslations('homepage');

  return (
    <div className="absolute z-20 left-0 right-0 text-center justify-center mx-4 flex flex-col items-center h-[40vh]">
      <h3 className="text-3xl sm:text-4xl lg:text-5xl w-[60%] sm:w-[50%] md:w-[82%] mx-auto font-thin my-5 select-none pointer-events-none">
        <span className="tracking-normal leading-tight">
          {t('hero.tagline')}
        </span>
      </h3>
    </div>
  );
};

export default Hero;
