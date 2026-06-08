// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getAllImps } from '@/lib/db/imps';
import { getAllSeedProducts } from '@/lib/db/seeds';

export async function getSearchModalData() {
  const [imps, seeds] = await Promise.all([getAllImps(), getAllSeedProducts()]);
  return { imps, seeds };
}
