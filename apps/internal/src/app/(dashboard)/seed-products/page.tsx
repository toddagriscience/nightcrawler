/**
 * Force dynamic rendering to ensure dashboard data is fetched at request time.
 */
export const dynamic = 'force-dynamic';

// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getSeedProducts } from './actions';
import SeedProductsClient from './components/seed-products-client';

/**
 * Seed products management page.
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function SeedProductsPage() {
  const initialProducts = await getSeedProducts();

  return <SeedProductsClient initialProducts={initialProducts} />;
}
