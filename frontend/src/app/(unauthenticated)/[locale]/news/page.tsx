// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { FeaturedNewsCarousel } from '@/components/common/news/featured-news-carousel';
import { LatestNewsTable } from '@/components/common/news/latest-news-table';
import sanityQuery from '@/lib/sanity/query';
import { SanityDocument } from 'next-sanity';

/**
 * Highlighted news & general news
 * @returns {JSX.Element} - The news page
 */
export default async function News() {
  const allNews = (await sanityQuery(
    'news'
  )) as unknown as Array<SanityDocument>;

  const featuredNews = allNews
    ? allNews.filter((article) => article.isFeatured)
    : [];

  return (
    <section id="newsroom" className="max-w-[1400px] mx-auto">
      <div className="fadeInAnimation relative z-10 mx-auto mt-24 max-w-[95%] pt-[calc(var(--headerHeight)+15px)] pb-4 md:pt-[calc(var(--headerHeight)+26px)] xl:overflow-x-visible ">
        <div className="flex flex-col items-start">
          <h2 className="pb-4 md:pb-6 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Newsroom
          </h2>
        </div>

        <FeaturedNewsCarousel items={featuredNews} />

        <div className="mb-16 mt-16">
          <h2 className="mb-6 md:mb-10 text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
            Latest News
          </h2>

          <LatestNewsTable items={allNews} />
        </div>
      </div>
    </section>
  );
}
