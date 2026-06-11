// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getAllImps } from '@/lib/db/imps';
import { getAllSeedProducts } from '@/lib/db/seeds';

/**
 * Server action that loads the data backing the search modal: every IMP and
 * every seed product, fetched concurrently.
 *
 * @returns An object with `imps` and `seeds` arrays for client-side filtering.
 */
export async function getSearchModalData() {
  const [imps, seeds] = await Promise.all([getAllImps(), getAllSeedProducts()]);
  return { imps, seeds };
}
