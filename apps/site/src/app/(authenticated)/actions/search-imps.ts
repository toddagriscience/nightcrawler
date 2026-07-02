// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { generalImp } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { ilike, or, sql } from 'drizzle-orm';

const MAX_RESULTS = 8;

export interface ImpHit {
  id: number;
  title: string;
  slug: string;
  snippet: string;
}

/**
 * Keyword search over general IMPs for the command palette. Matches title,
 * body, tags, and trigger. Small dataset, so no lazy loading needed.
 */
export async function searchImps(query: string): Promise<ImpHit[]> {
  await getAuthenticatedInfo();
  const q = query.trim();
  if (q.length === 0) return [];
  const pattern = `%${q}%`;

  const rows = await db
    .select({
      id: generalImp.id,
      title: generalImp.title,
      slug: generalImp.slug,
      content: generalImp.content,
      tags: generalImp.tags,
      triggerRaw: generalImp.triggerRaw,
    })
    .from(generalImp)
    .where(
      or(
        ilike(generalImp.title, pattern),
        ilike(generalImp.content, pattern),
        ilike(generalImp.triggerRaw, pattern),
        sql`array_to_string(${generalImp.tags}, ' ') ilike ${pattern}`
      )
    )
    .limit(MAX_RESULTS);

  return rows.map((r) => ({
    id: r.id,
    title: r.title ?? r.tags[0] ?? 'Management practice',
    slug: r.slug,
    snippet: r.content.slice(0, 120),
  }));
}
