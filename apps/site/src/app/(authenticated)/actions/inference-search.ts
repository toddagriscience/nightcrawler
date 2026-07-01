// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { searchKnowledge } from '@/lib/ai/search';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import type { SearchResult } from '@/lib/ai/types';

/**
 * Runs semantic inference search over IMPs and seed products for an
 * authenticated user.
 *
 * @param query - Natural-language question or search text
 * @returns Ranked mixed search results
 */
export async function runInferenceSearch(
  query: string
): Promise<SearchResult[]> {
  await getAuthenticatedInfo();
  return searchKnowledge(query.trim());
}
