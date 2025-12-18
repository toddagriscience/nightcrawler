// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { NewsCard } from '@/components/common';
import { useTheme } from '@/context/theme/ThemeContext';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import sanityQuery from '@/lib/sanity/query';
import { SanityDocument } from 'next-sanity';
import { urlFor } from '@/lib/sanity/utils';
const articlePlaceholderRoute = '/article-placeholder.webp';

/**
 * News highlight card component
 * @returns {JSX.Element} - The news highlight card component
 */
export default function NewsHighlights() {
  const { isDark: contextIsDark } = useTheme();
  const [allNews, setAllNews] = useState<SanityDocument[]>();

  const featuredNews = allNews
    ? allNews.filter((article) => article.isFeatured)
    : [];

  const locale = useLocale();

  useEffect(() => {
    async function getNews() {
      const news = (await sanityQuery(
        'news'
      )) as unknown as Array<SanityDocument>;
      setAllNews(news);
    }
    getNews();
  }, [setAllNews]);

  return (
    <div className="mb-8 gap-8 mx-auto flex flex-row max-w-[95%] flex-wrap justify-center">
      {featuredNews.map((article) => (
        <NewsCard
          key={article.slug.current}
          title={article.title}
          isDark={contextIsDark}
          image={
            article.thumbnail && article.thumbnail.url
              ? {
                  url: urlFor(article.thumbnail)?.url(),
                  alt: article.thumbnail.alt,
                  height: 400,
                  width: 400,
                }
              : {
                  url: articlePlaceholderRoute,
                  alt: '',
                  height: 400,
                  width: 400,
                }
          }
          source={article.source}
          date={new Date(article.date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          excerpt={article.summary}
          link={
            article.offSiteUrl && article.offSiteUrl.length > 0
              ? article.offSiteUrl
              : `${locale}/news/${article.slug.current}`
          }
        />
      ))}
    </div>
  );
}
