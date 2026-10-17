// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ImageResponse } from 'next/og';
import { getArticleBySlug, isInternalArticle } from '@/lib/sanity/articles';

/** A publication-specific title cover for legacy records without a CMS photograph. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = new URL(request.url).searchParams.get('locale') ?? 'en';
  if (locale !== 'en' && locale !== 'es')
    return new Response(null, { status: 404 });
  const article = await getArticleBySlug(slug, undefined, locale);
  if (!article || article._type !== 'news' || !isInternalArticle(article))
    return new Response(null, { status: 404 });
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 76px',
        background: '#f7f7f0',
        color: '#162d23',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: '0.08em' }}>
        TODD AGRISCIENCE
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: article.title.length > 80 ? 54 : 68,
          lineHeight: 1.12,
          maxWidth: 1048,
        }}
      >
        {article.title}
      </div>
      <div style={{ display: 'flex', fontSize: 25 }}>toddagriscience.com</div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=300' },
    }
  );
}
