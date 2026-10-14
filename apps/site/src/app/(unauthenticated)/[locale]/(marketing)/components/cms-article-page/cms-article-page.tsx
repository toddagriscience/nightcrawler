// Copyright © Todd Agriscience, Inc. All rights reserved.

import SanityBodyImage from '@/components/sanity/news/sanity-body-image';
import SanityNormal from '@/components/sanity/news/sanity-normal';
import SanityLink from '@/components/sanity/sanity-link';
import { getArticleCtasForPlacement } from '@/lib/sanity/article-cta-utils';
import type { SanityArticle } from '@/lib/sanity/article-types';
import {
  createArticleStructuredData,
  getArticlePresentation,
} from '@/lib/sanity/article-presentation';
import { PortableTextReactComponents } from 'next-sanity';

import { ArticleBody } from '../../index/[slug]/components/article-body';
import { ArticleFooter } from '../../index/[slug]/components/article-footer';
import { ArticleHeader } from '../../index/[slug]/components/article-header';
import {
  formatArticleHeroDate,
  parseArticleSubscripts,
} from '../../index/[slug]/utils';
import { NewsHighlightTilesSection } from '../news-highlight-tiles/news-highlight-tiles';
import { ArticleCtaButtons } from './article-cta-buttons';

/**
 * Shared Sanity article rendering for `/index/[slug]`, `/careers/[slug]`, and legacy routes that
 * converge on the marketing article template.
 *
 * @param props.article - Sanity document (validated by the route guard)
 * @param props.locale - Site locale segment used to present the hero date; English when omitted
 */
export function CmsArticlePage({
  article,
  locale,
  nonce,
}: {
  article: SanityArticle;
  locale?: string;
  /** Request nonce supplied by the server route. */
  nonce?: string;
}) {
  const facts = getArticlePresentation(article);
  const formattedDate = formatArticleHeroDate(article.date, locale);
  const subscripts = parseArticleSubscripts(article);
  const underHeaderCtas = getArticleCtasForPlacement(article, 'under-header');
  const footerCtas = getArticleCtasForPlacement(article, 'footer');

  const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: (props) => <SanityNormal {...props} />,

      h1: ({ children }) => (
        <h2 className="mt-[53px] text-3xl md:text-4xl lg:text-5xl font-normal leading-snug mb-2">
          {children}
        </h2>
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
    types: {
      image: (props) => <SanityBodyImage {...props} />,
    },
    marks: {
      link: (props) => <SanityLink {...props} />,
    },
  };

  const dateIso = facts.datePublished;

  return (
    <div className="max-w-[80%] mx-auto">
      <main className="container mx-auto flex min-h-screen flex-col gap-10 pt-16 md:gap-4 md:pt-20 lg:pt-24">
        <article
          className="flex flex-col gap-10 md:gap-4"
          aria-labelledby="article-title"
        >
          <script
            nonce={nonce}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                createArticleStructuredData(article)
              ).replace(/</g, '\\u003c'),
            }}
          />
          <ArticleHeader
            company={article.company}
            subtitle={article.subtitle}
            summary={facts.description}
            modifiedDateTime={facts.dateModified}
            formattedModifiedDate={formatArticleHeroDate(
              facts.dateModified,
              locale
            )}
            title={article.title}
            dateTime={dateIso}
            formattedDate={formattedDate !== '' ? formattedDate : undefined}
            ctaButtons={<ArticleCtaButtons ctas={underHeaderCtas} />}
          />
          <ArticleBody
            portableTextComponents={portableTextComponents}
            headerImageAsset={facts.imageAsset}
            headerImageUrl={facts.imageSrc}
            headerImageAlt={facts.imageAlt}
            content={article.content}
          />
          <ArticleFooter
            author={facts.owner}
            hasNamedAuthor={facts.hasNamedAuthor}
            footerSubtitle={article.subtitle}
            subscripts={subscripts}
          />
          <ArticleCtaButtons ctas={footerCtas} className="mb-16" />
        </article>
        <NewsHighlightTilesSection
          locale={locale}
          page="article"
          sectionId="article-highlights"
        />
      </main>
    </div>
  );
}
