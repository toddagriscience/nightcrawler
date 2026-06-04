// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SearchResult } from '@/lib/ai/types';

/** Props for rendering a single mixed search result card. */
export interface SearchResultCardProps {
  /** Result returned from the semantic search service */
  result: SearchResult;
}
