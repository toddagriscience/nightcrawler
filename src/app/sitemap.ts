import type { MetadataRoute } from 'next';
import featuredNews from '@/data/featured-news.json';
import { routing } from '@/i18n/config';
import { env } from '@/lib/env';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';

const baseUrl = env.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap =
    getStaticSitemap().concat(getNewsSitemap());

  return sitemapEntries;
}

function getStaticSitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  const staticPages = ['', '/who-we-are'];
  const excludedPages = ['/login', '/admin', '/api', '/_next', '/cdn-cgi'];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      // Skip excluded pages
      if (excludedPages.includes(page)) {
        continue;
      }

      const url = `${baseUrl}/${locale}${page}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: getSupportedLanguages(page),
        },
      });
    }
  }

  return sitemapEntries;
}

function getNewsSitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const newsArticle of featuredNews.newsArticles) {
      const url = `${baseUrl}/${locale}/${newsArticle.link}`;

      // Parse the date to get a proper lastModified date
      const articleDate = new Date(newsArticle.date);
      const lastModified = isNaN(articleDate.getTime())
        ? new Date()
        : articleDate;

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: getSupportedLanguages(newsArticle.link),
        },
      });
    }
  }

  return sitemapEntries;
}

function getSupportedLanguages(page: string): Languages<string> {
  const languages: { [key: string]: string } = {};
  routing.locales.forEach((loc) => {
    languages[loc] = `${baseUrl}/${loc}${page}`;
  });
  return languages;
}
