// Copyright © Todd Agriscience, Inc. All rights reserved.

import SanityNormal from '@/components/sanity/news/sanity-normal';
import SanityLink from '@/components/sanity/sanity-link';
import { getArticleBySlug, isInternalArticle } from '@/lib/sanity/articles';
import { urlFor } from '@/lib/sanity/utils';
import { PortableTextReactComponents } from 'next-sanity';
import { notFound, redirect } from 'next/navigation';

import { ArticleBody } from './components/article-body';
import { ArticleFooter } from './components/article-footer';
import { ArticleHeader } from './components/article-header';
import { formatArticleHeroDate, parseArticleSubscripts } from './utils';

/**
 * Canonical CMS article page at `/index/[slug]`.
 *
 * @param params - Slug for the article
 */
export default async function ArticleIndexPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, {
    next: { revalidate: 60 * 60 },
  });

  if (article == null) {
    notFound();
    return;
  }

  if (!isInternalArticle(article)) {
    redirect(article.offSiteUrl as string);
    return;
  }

  const headerImageUrl = article.headerImage
    ? urlFor(article.headerImage)?.url()
    : undefined;

  const formattedDate = formatArticleHeroDate(article.date);
  const subscripts = parseArticleSubscripts(article);

  const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: (props) => <SanityNormal {...props} summary={article.summary} />,

      h1: ({ children }) => (
        <h1 className="mt-[53px] text-3xl md:text-4xl lg:text-5xl font-normal leading-snug mb-2">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="mt-[53px] text-2xl md:text-3xl lg:text-[30px]/[41px] font-normal leading-snug mb-2">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-[53px] text-xl md:text-2xl lg:text-3xl font-normal leading-snug mb-2">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mt-[53px] text-xl md:text-2xl lg:text-3xl font-normal leading-snug mb-2">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="mt-[53px] text-lg md:text-xl lg:text-[20px]/[28px] font-normal leading-snug mb-2">
          {children}
        </h5>
      ),
    },
    marks: {
      link: (props) => <SanityLink {...props} />,
    },
  };

  const dateIso = article.date != null ? String(article.date) : '';

  return (
    <div className="max-w-[80%] mx-auto">
      <main className="mt-20 container mx-auto min-h-screen flex flex-col gap-10 md:gap-4">
        <ArticleHeader
          company={article.company}
          subtitle={article.subtitle}
          title={article.title}
          dateTime={dateIso !== '' ? dateIso : undefined}
          formattedDate={formattedDate !== '' ? formattedDate : undefined}
        />
        <ArticleBody
          portableTextComponents={portableTextComponents}
          headerImageAsset={article.headerImage}
          headerImageUrl={headerImageUrl}
          headerImageAlt={article.headerImage?.alt ?? article.title}
          content={article.content}
        />
        <ArticleFooter
          author={article.author}
          footerSubtitle={article.subtitle}
          subscripts={subscripts}
        />
      </main>
    </div>
  );
}
