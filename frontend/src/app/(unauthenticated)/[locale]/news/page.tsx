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
    <section id="newsroom" className="max-w-[1200px] mx-auto">
      <div className="fadeInAnimation relative z-10 mx-auto mt-24 lg:max-w-[95%] pt-[calc(var(--headerHeight)+15px)] pb-4 md:pt-[calc(var(--headerHeight)+26px)] xl:overflow-x-visible ">
        <div className="flex flex-col items-start">
          <h2 className="md:px-6 px-4 mb-4 sm:mb-6 lg:mb-12 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Newsroom
          </h2>
          <div className="w-full">
            <FeaturedNewsCarousel items={featuredNews} />
          </div>
          <div className="mb-16 mt-16 px-4 md:px-6">
            <h2 className="md:px-6 px-3 mb-6 md:mb-10 text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
              Latest News
            </h2>

            <LatestNewsTable items={allNews} />
          </div>
        </div>
      </div>
    </section>
  );
}
