// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useTheme } from '@/context/theme/ThemeContext';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '../../common';
import { QuoteProps } from './types/quote';

/**
 * Quote component
 * @param {QuoteProps} props - The component props
 * @returns {JSX.Element} - The quote component
 */
const Quote: React.FC<QuoteProps> = ({ isDark: propIsDark }) => {
  const { isDark: contextIsDark } = useTheme();
  const t = useTranslations('about');

  // Use prop isDark if provided, otherwise use context
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  return (
    <section
      id="who-we-are"
      className="flex flex-col justify-center items-center text-center px-0 lg:px-0 h-[65vh] md:h-[75vh]"
      role="region"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin text-center w-[85%] sm:w-[95%] md:w-[93%] lg:w-[75%] mx-auto">
        <span className="tracking-normal leading-tight">{t('quote')}</span>
      </h1>
      <Button
        href="/who-we-are"
        text={t('whoWeAre')}
        variant="outline"
        // isDark={isDark}
        className="mt-16 mx-auto w-[225px] font-thin text-xl"
      />
    </section>
  );
};

export default Quote;
