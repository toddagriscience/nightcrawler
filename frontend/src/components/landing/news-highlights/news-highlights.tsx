// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn, NewsCard } from '@/components/common';
import { Spinner } from '@/components/ui/spinner';
import { useTheme } from '@/context/theme/ThemeContext';
import sanityQuery from '@/lib/sanity/query';
import { urlFor } from '@/lib/sanity/utils';
import { useLocale } from 'next-intl';
import { SanityDocument } from 'next-sanity';
import { useEffect, useState } from 'react';
const articlePlaceholderRoute = '/article-placeholder.webp';

/**
 * News highlight card component
 * @returns {JSX.Element} - The news highlight card component
 */
export default function NewsHighlights() {
  const { isDark: contextIsDark } = useTheme();
  const [allNews, setAllNews] = useState<SanityDocument[]>();
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }
    getNews();
  }, [setAllNews]);

  return (
    <>
      {isLoading ? (
        <FadeIn className="min-h-[50vh] flex flex-col justify-center items-center">
          <Spinner className="size-8" />
        </FadeIn>
      ) : (
        <FadeIn>
          <div className="mb-8 mx-auto flex w-full max-w-[900px] flex-col items-center gap-8 lg:gap-4 lg:flex-row justify-center text-center lg:text-left h-full">
            {featuredNews.map((article) => (
              <NewsCard
                key={article.slug.current}
                title={article.title}
                isDark={contextIsDark}
                image={
                  article.thumbnail && article.thumbnail.asset
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
        </FadeIn>
      )}
    </>
  );
}
