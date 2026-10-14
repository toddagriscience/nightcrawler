// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Force dynamic rendering to ensure dashboard data is fetched at request time.
 */
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getImps } from './actions';
import ImpsClient from './components/imps-client';

/**
 * Integrated Management Plans page.
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function ImpsPage() {
  const initialImps = await getImps();

  return (
    <div className="space-y-6">
      <Link
        href="/imps/catalog"
        className="inline-flex underline underline-offset-4"
      >
        Open general IMP catalog (spreadsheet imports)
      </Link>
      <ImpsClient initialImps={initialImps} />
    </div>
  );
}
