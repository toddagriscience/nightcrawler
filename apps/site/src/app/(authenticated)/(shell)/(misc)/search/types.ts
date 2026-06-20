// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SearchResult } from '@/lib/ai/types';

/** Form values for the authenticated search page query form. */
export interface SearchFormValues {
  /** Raw free-text semantic search query */
  q: string;
}

/** Props for rendering a single mixed search result card. */
export interface SearchResultCardProps {
  /** Result returned from the semantic search service */
  result: SearchResult;
}

export interface SearchClientProps {
  query: string;
  results: SearchResult[];
  error: string | null;
}
