// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../../common';
import { useTheme } from '@/context/theme/ThemeContext';
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
      className="flex flex-col justify-center items-center text-center h-screen px-0 lg:px-0"
      role="region"
    >
      <h1 className="text-2xl lg:text-6xl tracking-tight font-thin text-center max-w-4xl w-[80%] mx-auto">
        {t('quote')}
      </h1>
      <Button
        href="/who-we-are"
        text={t('learnMore')}
        variant="outline"
        size="lg"
        isDark={isDark}
        className="mt-8 lg:mt-16 mx-auto"
      />
    </section>
  );
};

export default Quote;
