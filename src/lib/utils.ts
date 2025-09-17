// Copyright Todd LLC, All rights reserved.

import NewsCardProps from '@/components/common/news-card/types/news-card';
import { clsx, type ClassValue } from 'clsx';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind CSS class merging
 * Necessary for Shadcn UI compatibility with Tailwind CSS.
 * @param {ClassValue[]} inputs - Array of class values to merge
 * @returns {string} - Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hook for getting all of Todd's news. Currently gets news by utilizing i18n. This is a hook and not a generic util function because of the use of `useTranslations`.
 * TODO: Replace JSON data with database connection for dynamic content management
 * @typedef {Object} News
 * @property {NewsCardProps[]} featuredNews - The featured news as defined in this function
 * @property {NewsCardProps[]} allNews - General news + featured news
 */
export function useNews(): {
  featuredNews: NewsCardProps[];
  allNews: NewsCardProps[];
} {
  const t = useTranslations('articleExcerpts');

  // As far as I'm aware, this is the best way to do this. See https://next-intl.dev/docs/usage/messages#arrays-of-messages
  const featuredNews: NewsCardProps[] = [
    {
      title: t('farmlinkPartnership.title'),
      excerpt: t('farmlinkPartnership.excerpt'),
      date: t('farmlinkPartnership.date'),
      link: t('farmlinkPartnership.link'),
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
      link: t('ambrookPartnership.link'),
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
      link: t('regenerativeSeed.link'),
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
      link: t('whyRegenerative.link'),
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
      link: t('umichPartnership.link'),
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
      link: t('ftcPartnership.link'),
      source: t('ftcPartnership.source'),
      image: {
        url: t('ftcPartnership.image.url'),
        alt: t('ftcPartnership.image.alt'),
      },
    },
  ];

  allNews.push(...featuredNews);

  return { featuredNews: featuredNews, allNews: allNews };
}
