// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { getAllImps } from './db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IMPs | Todd',
};

const categoryLabels: Record<string, string> = {
  soil: 'Soil',
  planting: 'Planting',
  water: 'Water',
  insects_disease: 'Insects & Disease',
  harvest_storage: 'Harvest & Storage',
  go_to_market: 'Go to Market',
  seed_products: 'Seed Products',
};

export default async function ImpsPage() {
  await getAuthenticatedInfo();
  const imps = await getAllImps();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Integrated Management Plans
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse agronomic guides and best practices for your farm.
        </p>
      </div>

      {imps.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No IMPs available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {imps.map((imp) => (
            <Link
              key={imp.id}
              href={`/imp/${imp.slug}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 transition-all hover:border-[var(--border-strong)] hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {imp.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {categoryLabels[imp.category] ?? imp.category}
                  {imp.source ? ` · ${imp.source}` : ''}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 shrink-0">
                IMP
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
