// Copyright Todd LLC, All rights reserved.

'use client';

import { FeaturedNewsCarousel } from '@/components/common/news/featured-news-carousel';
import { useNews } from '@/lib/utils';

/**
 * Highlighted news & general news
 * @returns {JSX.Element} - The news page
 */
export default function News() {
  const { featuredNews } = useNews();

  return (
    <>
      <div className="fadeInAnimation relative z-10 overflow-x-hidden pt-[calc(var(--headerHeight)+15px)] pb-4 md:pt-[calc(var(--headerHeight)+26px)] xl:overflow-x-visible">
        <h1 className="text-slate-secondary mb-0 ml-1 hidden text-2xl font-light md:mb-6 md:block md:text-xl xl:mb-12">
          Todd Newsroom
        </h1>

        <h2 className="text-slate-secondary mb-8 text-2xl md:mb-0 md:text-5xl xl:text-7xl">
          Highlighted
        </h2>

        <FeaturedNewsCarousel items={featuredNews} />

        <div className="mt-20">
          <h3 className="text-slate-secondary mb-10 text-2xl md:text-4xl xl:text-5xl">
            Latest News
          </h3>

          {/* <LatestNewsTable items={allNewsItems} /> */}
        </div>
      </div>
    </>
  );
}
