// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getArticlesByCollection } from '@/lib/sanity/articles';
import type { ArticleCollection } from '@/lib/sanity/article-types';
import type { SanityArticle } from '@/lib/sanity/article-types';

/**
 * Loads articles for the home/news highlights carousel (client-invoked server action).
 *
 * @param collection - Preferred collection slice (defaults to `news`)
 * @returns Article documents
 */
export async function loadArticlesForHighlights(
  collection: ArticleCollection = 'news'
): Promise<SanityArticle[]> {
  return getArticlesByCollection(collection);
}
