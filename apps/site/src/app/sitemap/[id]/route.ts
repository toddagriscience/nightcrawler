// Copyright © Todd Agriscience, Inc. All rights reserved.

import sitemap from '@/lib/sitemap';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Prerenders both canonical child sitemap URLs. */
export function generateStaticParams() {
  return [{ id: 'main.xml' }, { id: 'careers.xml' }];
}

/** XML URL set with reciprocal links limited to actual published translations. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  if (id !== 'main.xml' && id !== 'careers.xml')
    return new Response('Not found', { status: 404 });
  const entries = await sitemap({
    id: Promise.resolve(id.replace(/\.xml$/, '')),
  });
  const body = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `<lastmod>${escapeXml(entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified)}</lastmod>`
        : '';
      const alternates = Object.entries(entry.alternates?.languages ?? {})
        .map(
          ([language, url]) =>
            `<xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(String(url))}" />`
        )
        .join('');
      return `<url><loc>${escapeXml(entry.url)}</loc>${lastModified}${entry.changeFrequency ? `<changefreq>${escapeXml(entry.changeFrequency)}</changefreq>` : ''}${entry.priority !== undefined ? `<priority>${escapeXml(String(entry.priority))}</priority>` : ''}${alternates}</url>`;
    })
    .join('');
  return new Response(
    // eslint-disable-next-line no-secrets/no-secrets -- XML declaration is a public format header.
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${body}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
