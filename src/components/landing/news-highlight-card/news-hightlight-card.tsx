'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote } from '../quote';
import { Button } from '../../common';
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
  const { t } = useLocale();

  // Use prop isDark if provided, otherwise use context
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

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
            {t('HomePage.newsHighlights.title')}
          </h1>
          <Button
            href="/news"
            text={t('HomePage.newsHighlights.viewAll')}
            variant="outline"
            size="lg"
            isDark={isDark}
            className="hidden md:flex self-end"
          />
        </div>

        {/* Placeholder for carousel - will be implemented later */}
        <div className="min-h-[200px] flex items-center justify-center text-center mb-8">
          <p className="text-lg opacity-60">
            {t('HomePage.newsHighlights.placeholder')}
          </p>
        </div>

        <Button
          href="/news"
          text={t('HomePage.newsHighlights.viewAll')}
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
