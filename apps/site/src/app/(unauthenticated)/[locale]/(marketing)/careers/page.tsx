// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FeaturedNewsCarousel } from '@/components/common/news/featured-news-carousel';
import { LatestNewsTable } from '@/components/common/news/latest-news-table';
import {
  getArticlesByCollection,
  getFeaturedArticles,
} from '@/lib/sanity/articles';

import { CareersExternship } from './components/careers-externship';

/**
 * Careers landing: Todd University externship content plus Sanity “career articles” (same detail route as `/index/[slug]`).
 *
 * @returns Careers page sections
 */
export default async function CareersPage() {
  const [allCareerArticles, featuredCareerArticles] = await Promise.all([
    getArticlesByCollection('careers'),
    getFeaturedArticles('careers'),
  ]);
  const showListings =
    allCareerArticles.length > 0 || featuredCareerArticles.length > 0;

  return (
    <>
      <CareersExternship />
      {showListings ? (
        <section
          aria-labelledby="career-articles-heading"
          className="max-w-[1200px] mx-auto px-4 md:px-6 pb-16"
        >
          <div className="fadeInAnimation relative z-10 mx-auto mt-12 lg:max-w-[95%] pb-4">
            <h2
              id="career-articles-heading"
              className="md:px-6 px-4 mb-4 sm:mb-6 lg:mb-12 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
            >
              Career articles
            </h2>
            {featuredCareerArticles.length > 0 ? (
              <div className="w-full mb-16">
                <FeaturedNewsCarousel items={featuredCareerArticles} />
              </div>
            ) : null}
            <div className="mb-16 mt-8 px-4 md:px-6">
              <h2 className="md:px-6 px-3 mb-6 md:mb-10 text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
                Latest career articles
              </h2>
              <LatestNewsTable items={allCareerArticles} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
