// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Carousel, NewsCard } from '@/components/common';
import { urlFor } from '@/lib/sanity/utils';
import { useLocale } from 'next-intl';
import { SanityDocument } from 'next-sanity';

const articlePlaceholderRoute = '/article-placeholder.webp';

/*
 * A carousel for featured news.
 * @param {Props} items - A list of `NewsCardProps`
 */
export function FeaturedNewsCarousel({
  items = [],
}: {
  items: SanityDocument[];
}) {
  const locale = useLocale();

  return (
    <Carousel isDark={true} showDots={true}>
      {items.map((article) => (
        <NewsCard
          title={article.title}
          key={article.slug.current}
          isDark={false}
          className="min-w-[450px] m:min-w-[580px] lg:min-w-[600px] w-full"
          image={
            article.thumbnail && article.thumbnail.asset
              ? {
                  url: urlFor(article.thumbnail)?.url(),
                  alt: article.thumbnail.alt,
                }
              : {
                  url: articlePlaceholderRoute,
                  alt: '',
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
              : `/news/${article.slug.current}`
          }
        />
      ))}
    </Carousel>
  );
}
