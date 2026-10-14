// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import type { Article, WithContext } from 'schema-dts';
import { env } from '@/lib/env';
import { getCanonicalUrl } from '@/lib/canonical-urls';
import { getArticleAlternates } from '@/lib/sanity/article-locales';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { urlFor } from '@/lib/sanity/utils';

/** Shared visible and machine-readable facts for a published article. */
export interface ArticlePresentation {
  description: string;
  owner: string;
  hasNamedAuthor: boolean;
  datePublished?: string;
  dateModified?: string;
  image: string;
  /** Relative own-route src for preview-safe image rendering. */
  imageSrc: string;
  imageAlt: string;
  imageAsset?: SanityArticle['headerImage'];
  canonical: string;
}

function readableText(value: string | undefined): string {
  return (value ?? '')
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function validDate(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return undefined;
  return Number.isNaN(Date.parse(value)) ? undefined : value;
}

/** Derives a real excerpt and explicit editorial ownership for legacy CMS records. */
export function getArticlePresentation(
  article: SanityArticle
): ArticlePresentation {
  const storedSummary = readableText(article.summary);
  const bodyText =
    (article.content ?? [])
      .filter((block) => block._type === 'block' && block.style === 'normal')
      .map((block) => block.children.map((child) => child.text ?? '').join(''))
      .map(readableText)
      .find((text) => text.length > 0) ?? '';
  const excerpt =
    bodyText.length > 220
      ? `${bodyText.slice(0, 217).replace(/\s+\S*$/, '')}…`
      : bodyText;
  const description =
    storedSummary && !/^(n\/?a|none)$/i.test(storedSummary)
      ? storedSummary
      : excerpt || article.title;
  const hasNamedAuthor = readableText(article.author).length > 0;
  const owner = hasNamedAuthor
    ? readableText(article.author)
    : readableText(article.editorialOwner) || 'Todd Agriscience';
  const datePublished = validDate(article.date);
  const modified = validDate(article.dateModified);
  const dateModified =
    datePublished &&
    modified &&
    Date.parse(modified) > Date.parse(datePublished)
      ? modified
      : undefined;
  const imageAsset = article.headerImage?.asset?._ref
    ? article.headerImage
    : article.thumbnail?.asset?._ref
      ? article.thumbnail
      : undefined;
  const language = article.language ?? 'en';
  const canonical = getCanonicalUrl(`/index/${article.slug.current}`, language);
  const image = imageAsset
    ? urlFor(imageAsset).width(1200).height(630).fit('crop').url()
    : `${env.baseUrl.replace(/\/$/, '')}/api/articles/${encodeURIComponent(article.slug.current)}/image?locale=${language}`;
  return {
    description,
    owner,
    hasNamedAuthor,
    datePublished,
    dateModified,
    image,
    imageSrc: imageAsset
      ? image
      : new URL(image).pathname + new URL(image).search,
    imageAlt: readableText(imageAsset?.alt) || article.title,
    imageAsset,
    canonical,
  };
}

/** Builds article-specific social metadata from the facts shown on the page. */
export function createArticleMetadata(article: SanityArticle): Metadata {
  const facts = getArticlePresentation(article);
  const title = `${article.title} | Todd`;
  return {
    title: { absolute: title },
    description: facts.description,
    alternates: getArticleAlternates(article),
    openGraph: {
      type: 'article',
      title,
      description: facts.description,
      url: facts.canonical,
      siteName: 'Todd',
      locale: article.language === 'es' ? 'es_US' : 'en_US',
      publishedTime: facts.datePublished,
      modifiedTime: facts.dateModified,
      authors: [facts.owner],
      images: [
        { url: facts.image, width: 1200, height: 630, alt: facts.imageAlt },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@toddagriscience',
      title,
      description: facts.description,
      images: [facts.image],
    },
  };
}

/** Article JSON-LD reflects the same publication, image, dates and ownership as the visible template. */
export function createArticleStructuredData(
  article: SanityArticle
): WithContext<Article> {
  const facts = getArticlePresentation(article);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: facts.description,
    image: [facts.image],
    author: facts.hasNamedAuthor
      ? { '@type': 'Person', name: facts.owner }
      : { '@type': 'Organization', name: facts.owner },
    publisher: {
      '@type': 'Organization',
      name: 'Todd Agriscience',
      url: 'https://toddagriscience.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toddagriscience.com/icon.png',
      },
    },
    datePublished: facts.datePublished,
    dateModified: facts.dateModified,
    inLanguage: article.language ?? 'en',
    url: facts.canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': facts.canonical },
  };
}
