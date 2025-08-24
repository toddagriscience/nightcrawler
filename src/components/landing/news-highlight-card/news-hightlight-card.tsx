'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from '../quote';
import { Button, LoadingSpinner } from '../../common';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';

interface NewsHighlightCardProps {
  carouselRef?: React.RefObject<HTMLDivElement>;
  isDark?: boolean;
}

const NewsHighlightCard: React.FC<NewsHighlightCardProps> = ({
  carouselRef: externalRef,
  isDark: propIsDark,
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const carouselRef = externalRef || internalRef;
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
      <motion.div
        ref={carouselRef}
        className="w-full rounded-2xl flex flex-col bg-[#CCC5B5] h-fit px-8 lg:px-28"
        animate={{
          backgroundColor: isDark ? '#2A2727' : '#CCC5B5',
          color: isDark ? '#FDFDFB' : '#2A2727',
        }}
      >
        <section id="news-carousel" className="flex flex-col" role="region">
          <div className="flex flex-row justify-center items-center mt-32 mb-32">
            <LoadingSpinner size="lg" isDark={isDark} />
          </div>
        </section>
        <Quote isDark={isDark} />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={carouselRef}
      className="w-full rounded-2xl flex flex-col bg-[#CCC5B5] h-fit px-8 lg:px-28"
      animate={{
        backgroundColor: isDark ? '#2A2727' : '#CCC5B5',
        color: isDark ? '#FDFDFB' : '#2A2727',
      }}
    >
      <section id="news-carousel" className="flex flex-col" role="region">
        <div className="flex flex-row justify-between items-start mt-32 font-light mb-8">
          <h1 className="text-3xl lg:text-8xl tracking-tight">
            {t('homepage.newsHighlights.title')}
          </h1>
          <Button
            href="/news"
            text={t('homepage.newsHighlights.viewAll')}
            variant="outline"
            size="lg"
            isDark={isDark}
            className="hidden md:flex self-end"
          />
        </div>

        {/* Placeholder for carousel - will be implemented later */}
        <div className="min-h-[200px] flex items-center justify-center text-center mb-8">
          <p className="text-lg opacity-60">
            {t('homepage.newsHighlights.placeholder')}
          </p>
        </div>

        <Button
          href="/news"
          text={t('homepage.newsHighlights.viewAll')}
          variant="outline"
          size="md"
          isDark={isDark}
          className="flex md:hidden self-center mt-4 mb-32"
        />
      </section>

      {/* Quote/About Section */}
      <Quote isDark={isDark} />
    </motion.div>
  );
};

export default NewsHighlightCard;
