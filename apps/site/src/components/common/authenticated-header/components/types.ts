// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Minimal item returned by the search dropdown queries. */
export interface DropdownItem {
  /** Database identifier of the matched record. */
  id: number;
  /** Customer-facing title shown in the dropdown row. */
  title: string;
  /** URL-safe slug used to build the navigation link. */
  slug: string;
  /** Which route family this result belongs to. */
  resultType: 'imp' | 'seed';
}

/** Categorized search dropdown results with IMPs and seed products separated. */
export interface DropdownResults {
  /** Top IMP results for the dropdown. */
  imps: DropdownItem[];
  /** Top seed product results for the dropdown. */
  seeds: DropdownItem[];
}
