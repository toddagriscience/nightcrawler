// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Carousel, NewsCard } from '@/components/common';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { urlFor } from '@/lib/sanity/utils';
import { useLocale } from 'next-intl';

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

/*
 * A carousel for featured news.
 * @param {Props} items - A list of `NewsCardProps`
 */
export function FeaturedNewsCarousel({
  items = [],
}: {
  items: SanityArticle[];
}) {
  const locale = useLocale();

  return (
    <Carousel isDark={true} showDots={true}>
      {items.map((article) => (
        <NewsCard
          title={article.title}
          key={article.slug.current}
          isDark={false}
          className="flex-none h-auto w-[90vw] sm:w-[90%] md:max-w-[500px] lg:max-w-[500px]"
          // "min-w-[480px] sm:min-w-[500px] md:min-w-[580px] lg:min-w-[600px] w-full"
          image={
            article.thumbnail && article.thumbnail.asset
              ? {
                  url:
                    urlFor(article.thumbnail)?.url() ?? articlePlaceholderRoute,
                  alt: article.thumbnail.alt ?? '',
                }
              : {
                  url: articlePlaceholderRoute,
                  alt: '',
                }
          }
          source={article.source ?? ''}
          date={formatArticleListingDate(article.date, locale)}
          excerpt={article.summary ?? ''}
          link={getArticleCardHref(article)}
        />
      ))}
    </Carousel>
  );
}
