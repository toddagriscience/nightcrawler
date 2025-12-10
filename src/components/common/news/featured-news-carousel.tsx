// Copyright Todd Agriscience, Inc. All rights reserved.

import { Carousel, NewsCard } from '@/components/common';
import { urlFor } from '@/lib/sanity/utils';
import { SanityDocument } from 'next-sanity';
import ArticlePlaceholder from '@/../public/article-placeholder.webp';

/*
 * A carousel for featured news.
 * @param {Props} items - A list of `NewsCardProps`
 */
export function FeaturedNewsCarousel({
  items = [],
}: {
  items: SanityDocument[];
}) {
  return (
    <Carousel isDark={true} showDots={true}>
      {items.map((article) => (
        <NewsCard
          title={article.title}
          key={article.title}
          isDark={false}
          image={
            article.thumbnail
              ? {
                  url: urlFor(article.thumbnail)?.url(),
                  alt: article.thumbnail.alt,
                }
              : { url: ArticlePlaceholder.src, alt: '' }
          }
          source={article.source}
          date={article.date}
          excerpt={article.summary}
          link={
            article.offSiteUrl && article.offSiteUrl.length > 0
              ? article.offSiteUrl
              : window.location.href + '/' + article.slug.current
          }
        />
      ))}
    </Carousel>
  );
}
