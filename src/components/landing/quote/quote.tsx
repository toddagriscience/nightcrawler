'use client';

import React, { useEffect } from 'react';
import { Button, LoadingSpinner } from '../../common';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';

interface QuoteProps {
  isDark?: boolean;
}

const Quote: React.FC<QuoteProps> = ({ isDark: propIsDark }) => {
  const { isDark: contextIsDark } = useTheme();
  const { t, loadModule, isLoading } = useLocale();

  // Load homepage module on mount
  useEffect(() => {
    loadModule('homepage').catch(console.warn);
  }, [loadModule]);

  // Use prop isDark if provided, otherwise use context
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  if (isLoading) {
    return (
      <section
        id="about-us"
        className="flex flex-col justify-center items-center text-center h-screen px-0 lg:px-0"
        role="region"
      >
        <LoadingSpinner size="lg" isDark={isDark} />
      </section>
    );
  }

  return (
    <section
      id="about-us"
      className="flex flex-col justify-center items-center text-center h-screen px-0 lg:px-0"
      role="region"
    >
      <h1 className="text-2xl lg:text-6xl tracking-tight font-thin text-center max-w-4xl mx-auto">
        {t('homepage.quote.text')}
      </h1>
      <Button
        href="/about"
        text={t('homepage.quote.button')}
        variant="outline"
        size="lg"
        isDark={isDark}
        className="mt-8 lg:mt-16 mx-auto"
      />
    </section>
  );
};

export default Quote;
