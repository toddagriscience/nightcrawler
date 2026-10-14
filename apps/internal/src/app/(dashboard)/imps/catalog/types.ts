// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { generalImp } from '@nightcrawler/db/schema';

/** The spreadsheet-backed IMP catalog row. */
export type GeneralImp = typeof generalImp.$inferSelect;

/** Fields operators may edit; IDs, embeddings and dates are server-owned. */
export interface GeneralImpFields {
  title: string;
  slug: string;
  tags: string;
  triggerRaw: string;
  content: string;
}

/** Explicit result so failed saves keep the editor open. */
export type SaveGeneralImpResult =
  { ok: true; imp: GeneralImp } | { ok: false; error: string };
