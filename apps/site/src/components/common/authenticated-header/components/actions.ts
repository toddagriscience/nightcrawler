// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

/**
 * @fileoverview
 * Server actions that power the navbar search dropdown.
 * Delegates to cached query functions so repeated calls with the same
 * arguments hit the one-hour `use cache` boundary instead of the DB.
 */

import type { DropdownResults } from './types';
import { getDefaultDropdownItems, searchDropdownItems } from './queries';

/**
 * Fetches categorized dropdown results for the navbar search bar.
 * Returns default (first-3) items when the query is empty,
 * or embedding-ranked results when a search term is provided.
 *
 * @param query - Raw search text from the input field
 * @returns Categorized IMP and seed product results for the dropdown
 */
export async function fetchDropdownItems(
  query: string
): Promise<DropdownResults> {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return getDefaultDropdownItems();
  }

  return searchDropdownItems(trimmed);
}
