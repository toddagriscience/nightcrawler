// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { generalImp } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import {
  impDisplayTitle,
  previewText,
} from '@/app/(authenticated)/components/search-panel/search-display';
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
  // Escape ILIKE wildcards (backslash is Postgres's default escape char) so
  // user input like "%" or "_" matches literally instead of over-matching.
  const escaped = q.replace(/[\\%_]/g, '\\$&');
  const pattern = `%${escaped}%`;

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
    title: impDisplayTitle(r.title, r.tags),
    slug: r.slug,
    snippet: previewText(r.content, 120),
  }));
}
