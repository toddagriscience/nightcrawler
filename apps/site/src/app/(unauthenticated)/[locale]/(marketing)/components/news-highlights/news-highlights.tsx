// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn, NewsCard } from '@/components/common';
import { Spinner } from '@/components/ui/spinner';
import { useTheme } from '@/context/theme/ThemeContext';
import { loadArticlesForHighlights } from '@/lib/sanity/article-actions';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { urlFor } from '@/lib/sanity/utils';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

const articlePlaceholderRoute = '/article-placeholder.webp';

/** Formats listing dates with a safe fallback when `date` is missing. */
function formatArticleListingDate(
  dateValue: string | undefined,
  locale: string
): string {
  const safe = dateValue !== undefined && dateValue.length > 0 ? dateValue : '';
  if (safe.length === 0) return '';
  return new Date(safe).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * News highlight card component
 * @returns {JSX.Element} - The news highlight card component
 */
export default function NewsHighlights() {
  const { isDark: contextIsDark } = useTheme();
  const [allNews, setAllNews] = useState<SanityArticle[]>();
  const [isLoading, setIsLoading] = useState(true);

  const featuredNews = allNews
    ? allNews.filter((article) => article.isFeatured)
    : [];

  const locale = useLocale();

  useEffect(() => {
    async function getNews() {
      const news = await loadArticlesForHighlights('news');
      setAllNews(news);
      setIsLoading(false);
    }
    getNews();
  }, [setAllNews]);

  return (
    <>
      {isLoading ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <FadeIn>
          <div className="mx-auto mb-8 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:gap-4">
            {featuredNews.map((article) => (
              <NewsCard
                className="basis-1 lg:basis-1/2"
                key={article.slug.current}
                title={article.title}
                isDark={contextIsDark}
                image={
                  article.thumbnail && article.thumbnail.asset
                    ? {
                        url:
                          urlFor(article.thumbnail)
                            ?.width(400)
                            .height(400)
                            .url() ?? articlePlaceholderRoute,
                        alt: article.thumbnail.alt ?? '',
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
                source={article.source ?? ''}
                date={formatArticleListingDate(article.date, locale)}
                excerpt={article.summary ?? ''}
                link={getArticleCardHref(article)}
              />
            ))}
          </div>
        </FadeIn>
      )}
    </>
  );
}
