// Copyright Todd LLC, All rights reserved.

'use client';

import { FeaturedNewsCarousel } from '@/components/common/news/featured-news-carousel';
import { useTranslations } from 'next-intl';
import NewsCardProps from '@/components/common/news-card/types/news-card';

/**
 * Highlighted news & general news
 * @returns {JSX.Element} - The news page
 */
export default function News() {
  const t = useTranslations('articleExcerpts');

  // As far as I'm aware, this is the best way to do this. See https://next-intl.dev/docs/usage/messages#arrays-of-messages
  const featuredNews: NewsCardProps[] = [
    {
      title: t('farmlinkPartnership.title'),
      excerpt: t('farmlinkPartnership.excerpt'),
      date: t('farmlinkPartnership.date'),
      slug: t('farmlinkPartnership.slug'),
      source: t('farmlinkPartnership.source'),
      image: {
        url: t('farmlinkPartnership.image.url'),
        alt: t('farmlinkPartnership.image.alt'),
      },
    },
    {
      title: t('ambrookPartnership.title'),
      excerpt: t('ambrookPartnership.excerpt'),
      date: t('ambrookPartnership.date'),
      slug: t('ambrookPartnership.slug'),
      source: t('ambrookPartnership.source'),
      image: {
        url: t('ambrookPartnership.image.url'),
        alt: t('ambrookPartnership.image.alt'),
      },
    },
    {
      title: t('regenerativeSeed.title'),
      excerpt: t('regenerativeSeed.excerpt'),
      date: t('regenerativeSeed.date'),
      slug: t('regenerativeSeed.slug'),
      source: t('regenerativeSeed.source'),
      image: {
        url: t('regenerativeSeed.image.url'),
        alt: t('regenerativeSeed.image.alt'),
      },
    },
  ];

  const allNews: NewsCardProps[] = [
    {
      title: t('whyRegenerative.title'),
      excerpt: t('whyRegenerative.excerpt'),
      date: t('whyRegenerative.date'),
      slug: t('whyRegenerative.slug'),
      source: t('whyRegenerative.source'),
      image: {
        url: t('whyRegenerative.image.url'),
        alt: t('whyRegenerative.image.alt'),
      },
    },
    {
      title: t('umichPartnership.title'),
      excerpt: t('umichPartnership.excerpt'),
      date: t('umichPartnership.date'),
      slug: t('umichPartnership.slug'),
      source: t('umichPartnership.source'),
      image: {
        url: t('umichPartnership.image.url'),
        alt: t('umichPartnership.image.alt'),
      },
    },
    {
      title: t('ftcPartnership.title'),
      excerpt: t('ftcPartnership.excerpt'),
      date: t('ftcPartnership.date'),
      slug: t('ftcPartnership.slug'),
      source: t('ftcPartnership.source'),
      image: {
        url: t('ftcPartnership.image.url'),
        alt: t('ftcPartnership.image.alt'),
      },
    },
  ];

  allNews.push(...featuredNews);

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
