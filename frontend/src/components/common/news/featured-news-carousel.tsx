// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Carousel, NewsCard } from '@/components/common';
import { urlFor } from '@/lib/sanity/utils';
import { SanityDocument } from 'next-sanity';
import { useLocale } from 'next-intl';
import useCurrentUrl from '@/lib/hooks/useCurrentUrl';

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
  const windowHref = useCurrentUrl();

  return (
    <Carousel isDark={true} showDots={true}>
      {items.map((article) => (
        <NewsCard
          title={article.title}
          key={article.title}
          isDark={false}
          image={
            article.thumbnail && article.thumbnail.url
              ? {
                  url: urlFor(article.thumbnail)?.url(),
                  alt: article.thumbnail.alt,
                }
              : { url: articlePlaceholderRoute, alt: '' }
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
              : windowHref + '/' + article.slug.current
          }
        />
      ))}
    </Carousel>
  );
}
