// Copyright Todd LLC, All rights reserved.

import featuredNews from '@/data/featured-news.json';
import { routing } from '@/i18n/config';
import { env } from '@/lib/env';
import { NextResponse } from 'next/server';

/**
 * Generate news sitemap for the website
 * @returns {Promise<NextResponse>} - The news sitemap XML response
 */
export async function GET(): Promise<NextResponse> {
  const baseUrl = env.baseUrl;

  // Generate news sitemap entries for each locale and news article
  const sitemapEntries: Array<{
    url: string;
    lastModified: string;
    changeFrequency:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
    priority: number;
    alternates?: {
      languages: Record<string, string>;
    };
  }> = [];

  for (const locale of routing.locales) {
    for (const newsArticle of featuredNews.newsArticles) {
      const url = `${baseUrl}/${locale}/${newsArticle.link}`;

      // Parse the date to get a proper lastModified date
      const articleDate = new Date(newsArticle.date);
      const lastModified = isNaN(articleDate.getTime())
        ? new Date().toISOString()
        : articleDate.toISOString();

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [
              loc,
              `${baseUrl}/${loc}/${newsArticle.link}`,
            ])
          ),
        },
      });
    }
  }

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
    ${
      entry.alternates
        ? Object.entries(entry.alternates.languages)
            .map(
              ([lang, href]) =>
                `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`
            )
            .join('\n')
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
