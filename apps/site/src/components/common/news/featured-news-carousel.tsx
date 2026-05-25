// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Carousel, NewsCard } from '@/components/common';
import { formatArticleListDate } from '@/lib/sanity/article-display-dates';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { urlFor } from '@/lib/sanity/utils';

const articlePlaceholderRoute = '/article-placeholder.webp';

/*
 * A carousel for featured news.
 * @param {Props} items - A list of `NewsCardProps`
 */
export function FeaturedNewsCarousel({
  items = [],
}: {
  items: SanityArticle[];
}) {
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
          date={formatArticleListDate(article.date)}
          excerpt={article.summary ?? ''}
          link={getArticleCardHref(article)}
        />
      ))}
    </Carousel>
  );
}
