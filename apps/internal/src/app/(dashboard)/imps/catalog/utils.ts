// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';
import type { GeneralImp } from './types';

/** Validated allowlist, independent of compile-time server-action types. */
export const generalImpFieldsSchema = z.object({
  title: z.string().trim().max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tags: z
    .string()
    .max(2020)
    .transform((value) => [
      ...new Set(
        value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ])
    .pipe(z.array(z.string().max(100)).max(20)),
  triggerRaw: z.string().trim().max(2000),
  content: z.string().trim().min(1).max(100000),
});

/** Display-only grouping; compound triggers are intentionally not evaluated. */
export function groupGeneralImps(imps: GeneralImp[]) {
  const ranges = new Map<
    string,
    {
      subject: string;
      tags: string[];
      low: GeneralImp[];
      ideal: GeneralImp[];
      high: GeneralImp[];
    }
  >();
  const other: GeneralImp[] = [];
  for (const imp of imps) {
    const match = imp.triggerRaw?.match(/^(low|ideal|high)\s+(@[\w-]+)$/i);
    if (!match) {
      other.push(imp);
      continue;
    }
    const subject = match[2].toLowerCase();
    const key = JSON.stringify([subject, [...imp.tags].sort()]);
    let group = ranges.get(key);
    if (!group) {
      group = { subject, tags: imp.tags, low: [], ideal: [], high: [] };
      ranges.set(key, group);
    }
    group[match[1].toLowerCase() as 'low' | 'ideal' | 'high'].push(imp);
  }
  return { ranges: [...ranges.values()], other };
}
