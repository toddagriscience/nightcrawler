// Copyright Todd LLC, All rights reserved.

'use client';

import { Button, Carousel, NewsCard } from '@/components/common';
import { useTheme } from '@/context/theme/ThemeContext';
import newsData from '@/data/featured-news.json';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useRef } from 'react';
import { Quote } from '../index';
import { NewsHighlightCardProps } from './types/news-highlight-card';

/**
 * News highlight card component
 * @param {NewsHighlightCardProps} props - The component props
 * @returns {JSX.Element} - The news highlight card component
 */
const NewsHighlightCard: React.FC<NewsHighlightCardProps> = ({
  carouselRef: externalRef,
  isDark: propIsDark,
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const carouselRef = externalRef || internalRef;
  const { isDark: contextIsDark } = useTheme();
  const t = useTranslations('common');
  const tNews = useTranslations('homepage');

  // Use prop isDark if provided, otherwise use context
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  // TODO: Replace JSON data with database connection for dynamic content management

  // TODO: Replace JSON data with database connection for dynamic content management

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
            {tNews('news.news_highlights')}
          </h1>
          <Button
            href="/news"
            text={t('buttons.view_all')}
            variant="outline"
            size="lg"
            isDark={isDark}
            className="hidden md:flex self-end"
          />
        </div>

        {/* News Carousel */}
        <div className="mb-8">
          <Carousel isDark={isDark} showDots={true} loop={true}>
            {newsData.newsArticles.map((article) => (
              <NewsCard
                key={article.id}
                isDark={isDark}
                image={article.image}
                source={article.source}
                date={article.date}
                headline={article.headline}
                link={article.link}
              />
            ))}
          </Carousel>
        </div>

        <Button
          href="/news"
          text={t('buttons.view_all')}
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
