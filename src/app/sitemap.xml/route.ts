// Copyright Todd Agriscience, Inc. All rights reserved.

import { getNewsSitemap, getStaticSitemap } from '../sitemap';
import type { MetadataRoute } from 'next';

// Revalidate sitemap every 24 hours (86400 seconds)
export const revalidate = 86400;

/**
 * Escapes XML special characters to prevent injection attacks
 * @param {string} text - The text to escape
 * @returns {string} - Escaped XML text
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a sitemap entry as XML with proper indentation
 * @param {MetadataRoute.Sitemap[0]} entry - The sitemap entry to format
 * @param {number} indent - The indentation level (number of spaces)
 * @returns {string} - Formatted XML string for the entry
 */
function formatSitemapEntry(
  entry: MetadataRoute.Sitemap[0],
  indent: number
): string {
  const spaces = ' '.repeat(indent);
  const childSpaces = ' '.repeat(indent + 2);

  let xml = `${spaces}<url>\n`;
  xml += `${childSpaces}<loc>${escapeXml(entry.url)}</loc>\n`;

  if (entry.lastModified) {
    const lastModified =
      entry.lastModified instanceof Date
        ? entry.lastModified.toISOString()
        : typeof entry.lastModified === 'string'
          ? entry.lastModified
          : '';
    if (lastModified) {
      xml += `${childSpaces}<lastmod>${escapeXml(lastModified)}</lastmod>\n`;
    }
  }

  if (entry.changeFrequency) {
    xml += `${childSpaces}<changefreq>${escapeXml(entry.changeFrequency)}</changefreq>\n`;
  }

  if (entry.priority !== undefined) {
    xml += `${childSpaces}<priority>${entry.priority}</priority>\n`;
  }

  if (entry.alternates?.languages) {
    const languages = entry.alternates.languages;
    Object.entries(languages).forEach(([lang, url]) => {
      if (url) {
        xml += `${childSpaces}<xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(url)}" />\n`;
      }
    });
  }

  xml += `${spaces}</url>`;
  return xml;
}

/**
 * Generates a formatted XML sitemap with proper indentation and organization
 * Groups entries by type (static pages vs news articles) for better readability
 * @returns {Response} - XML response with formatted sitemap
 */
export async function GET(): Promise<Response> {
  const staticEntries = getStaticSitemap();
  const newsEntries = getNewsSitemap();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Format static pages first
  staticEntries.forEach((entry) => {
    xml += formatSitemapEntry(entry, 2);
    xml += '\n';
  });

  // Format news articles
  newsEntries.forEach((entry) => {
    xml += formatSitemapEntry(entry, 2);
    xml += '\n';
  });

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}

