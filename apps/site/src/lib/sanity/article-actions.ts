// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getNewsIndexArticles } from '@/lib/sanity/articles';
import type { SanityArticle } from '@/lib/sanity/article-types';

/**
 * Loads articles for the home/news highlights carousel (client-invoked server
 * action). Returns the news taxonomy; the caller filters to featured rows.
 *
 * @returns Article documents from the news taxonomy
 */
export async function loadArticlesForHighlights(): Promise<SanityArticle[]> {
  return getNewsIndexArticles();
}
