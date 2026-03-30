// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Search result returned by the mixed IMP + seed semantic search flow. */
export interface SearchResult {
  /** Database identifier of the matched record */
  id: number;
  /** Customer-facing title shown in search results */
  title: string;
  /** URL-safe slug used to build the destination route */
  slug: string;
  /** Preview text shown on the search result card */
  content: string;
  /** Optional source attribution for the result */
  source: string | null;
  /** Human-readable category or grouping label */
  category: string;
  /** Which route family this result belongs to */
  resultType: 'imp' | 'seed';
  /** Similarity score used for result ranking */
  similarity: number;
  /** Remaining units in stock for a seed result */
  stock: number | null;
  /** Price per unit in cents for a seed result */
  priceInCents: number | null;
  /** Unit label used for seed result pricing */
  unit: string | null;
}
