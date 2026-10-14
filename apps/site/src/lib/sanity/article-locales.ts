// Copyright © Todd Agriscience, Inc. All rights reserved.

import { isActiveJob } from '@/lib/sanity/job-posting';
import { getCanonicalUrl } from '@/lib/canonical-urls';
import type { SanityArticle } from '@/lib/sanity/article-types';

/** Selects one published document per translation group, preferring the requested language. */
export function selectArticlesForLocale(
  articles: SanityArticle[],
  locale: string
): SanityArticle[] {
  const selected = new Map<string, SanityArticle>();
  for (const article of articles) {
    if (article._id.startsWith('drafts.')) continue;
    const language = article.language ?? 'en';
    if (language !== locale && language !== 'en') continue;
    const group = article.translationGroup || article._id;
    const existing = selected.get(group);
    if (
      !existing ||
      ((existing.language ?? 'en') !== locale && language === locale)
    )
      selected.set(group, article);
  }
  return [...selected.values()];
}

/** Whether a listing is showing an English document because no Spanish publication exists. */
export function isEnglishArticleFallback(
  article: Pick<SanityArticle, 'language'>,
  locale: string
): boolean {
  return locale === 'es' && (article.language ?? 'en') === 'en';
}

/** Canonical and hreflang URLs come only from this document's published on-site variants. */
export function getArticleAlternates(article: SanityArticle) {
  const language = article.language ?? 'en';
  const path =
    article._type === 'career'
      ? `/careers/${article.slug.current}`
      : `/index/${article.slug.current}`;
  const variants = article.publishedTranslations ?? [
    { _id: article._id, _type: article._type, language, slug: article.slug },
  ];
  const languages: Record<string, string> = {};
  for (const variant of variants) {
    if (variant._type === 'career' && !isActiveJob(variant)) continue;
    const variantPath =
      variant._type === 'career'
        ? `/careers/${variant.slug.current}`
        : `/index/${variant.slug.current}`;
    languages[variant.language] = getCanonicalUrl(
      variantPath,
      variant.language
    );
  }
  languages[language] = getCanonicalUrl(path, language);
  languages['x-default'] = languages.en ?? languages[language];
  return { canonical: getCanonicalUrl(path, language), languages };
}
