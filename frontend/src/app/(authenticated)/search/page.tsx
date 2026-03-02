// Copyright © Todd Agriscience, Inc. All rights reserved.

import { searchKnowledge } from '@/lib/ai/search';
import { logger } from '@/lib/logger';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { notFound } from 'next/navigation';
import { SearchClient } from './search-client';

/**
 * Knowledge base search page for authenticated farmers.
 * Reads the query from URL params on the server, runs semantic search,
 * and passes results to the client renderer.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const currentUser = await getAuthenticatedInfo();

  if (!currentUser.approved) {
    notFound();
  }

  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? '';

  let results: Awaited<ReturnType<typeof searchKnowledge>> = [];
  let error: string | null = null;

  if (query.length > 0) {
    try {
      results = await searchKnowledge(query);
    } catch (searchError) {
      logger.error('[SearchPage] Search failed:', searchError);
      error = 'Search failed. Please try again.';
    }
  }

  return <SearchClient query={query} results={results} error={error} />;
}
