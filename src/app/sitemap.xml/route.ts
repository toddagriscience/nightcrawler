// Copyright Todd LLC, All rights reserved.

import { routing } from '@/i18n/config';
import { env } from '@/lib/env';
import { NextResponse } from 'next/server';

/**
 * Generate sitemap for the website
 * @returns {Promise<NextResponse>} - The sitemap XML response
 */
export async function GET(): Promise<NextResponse> {
  const baseUrl = env.baseUrl;

  // Static pages that exist for all locales
  const staticPages = [
    '',
    '/who-we-are',
    // Add more static pages as they are created
  ];

  // Pages to exclude from sitemap (admin, login, etc.)
  const excludedPages = ['/login', '/admin', '/api', '/_next', '/cdn-cgi'];

  // Generate sitemap entries for each locale and page combination
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
    for (const page of staticPages) {
      // Skip excluded pages
      if (excludedPages.some((excludedPage) => page.includes(excludedPage))) {
        continue;
      }

      const url = `${baseUrl}/${locale}${page}`;

      sitemapEntries.push({
        url,
        lastModified: new Date().toISOString(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
          ),
        },
      });
    }
  }

  // Add any dynamic pages here (e.g., news articles, blog posts)
  // Example for future news pages:
  // const newsPages = await getNewsPages();
  // for (const newsPage of newsPages) {
  //   for (const locale of routing.locales) {
  //     sitemapEntries.push({
  //       url: `${baseUrl}/${locale}/news/${newsPage.slug}`,
  //       lastModified: new Date(newsPage.updatedAt).toISOString(),
  //       changeFrequency: 'weekly',
  //       priority: 0.6,
  //       alternates: {
  //         languages: Object.fromEntries(
  //           routing.locales.map((loc) => [
  //             loc,
  //             `${baseUrl}/${loc}/news/${newsPage.slug}`,
  //           ])
  //         ),
  //       },
  //     });
  //   }
  // }

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
