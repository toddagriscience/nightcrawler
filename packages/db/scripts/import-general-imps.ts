// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Imports the general IMPs spreadsheet tab into the general_imp table.
 * The spreadsheet is the source of truth; this rebuilds the DB mirror, so it
 * is safe to re-run after every sheet edit.
 *
 * Usage:
 *   1. Google Sheets -> the "Integrated Management Practices (IMPs)" tab ->
 *      File -> Download -> Comma-separated values (.csv), save to
 *      packages/db/data/general-imps.csv
 *   2. Dry run (writes nothing):   tsx scripts/import-general-imps.ts
 *   3. Commit to local DB:         tsx scripts/import-general-imps.ts --commit
 *
 * Flags:
 *   --file <path>   CSV path (default: data/general-imps.csv)
 *   --commit        Actually write to the local DB (otherwise dry-run)
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, inArray, notInArray } from 'drizzle-orm';
import { generalImp, knowledgeArticle } from '../src/schema';
import {
  embed,
  getArg,
  hash,
  parseCsv,
  requireLocalDatabaseUrl,
  slugify,
} from './lib/importer-lib';

// ---- CLI args -------------------------------------------------------------
const COMMIT = process.argv.includes('--commit');
const CSV_PATH = getArg('file') ?? 'data/general-imps.csv';

// ---- helpers --------------------------------------------------------------
/** Strip the single quotes the sheet wraps concept titles in, e.g. 'Copper'. */
function cleanTitle(s: string): string {
  return s.replace(/^['"]+|['"]+$/g, '').trim();
}

interface ParsedImp {
  title: string | null;
  tags: string[];
  triggerRaw: string | null;
  content: string;
}

/** Sheet layout per row: [blank, Category, Trigger, Title, Body]. */
function classify(rows: string[][]): ParsedImp[] {
  const imps: ParsedImp[] = [];
  for (const raw of rows) {
    const cells = (raw ?? []).map((c) => (c ?? '').trim());
    const category = cells[1] ?? '';
    const trigger = cells[2] ?? '';
    const title = cleanTitle(cells[3] ?? '');
    const body = cells[4] ?? '';

    // Skip blank separator rows.
    if (!body) continue;
    // Skip the header row: its Category cell reads "Category" and its Body cell
    // reads "Body" (match either so a reworded header still gets dropped).
    if (
      category.toLowerCase() === 'category' ||
      body.toLowerCase() === 'body'
    ) {
      continue;
    }

    imps.push({
      title: title || null,
      tags: category
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      triggerRaw: trigger || null,
      content: body,
    });
  }
  return imps;
}

/** Text embedded and fingerprinted for change-detection on re-import. */
function embedText(imp: ParsedImp): string {
  return [imp.title ?? '', imp.tags.join(' '), imp.content]
    .filter(Boolean)
    .join('\n');
}

// ---- main -----------------------------------------------------------------
async function main() {
  const csv = readFileSync(CSV_PATH, 'utf8');
  const rows = parseCsv(csv);
  const imps = classify(rows);

  console.log(`\nParsed ${CSV_PATH}`);
  console.log(`  IMPs:         ${imps.length}`);
  console.log(`  With trigger: ${imps.filter((i) => i.triggerRaw).length}`);
  console.log(`  With title:   ${imps.filter((i) => i.title).length}`);
  console.log('\n  Sample (first 5):');
  for (const imp of imps.slice(0, 5)) {
    console.log(
      `    [${imp.title ?? '(no title)'}] tags=${JSON.stringify(imp.tags)} ` +
        `trigger=${imp.triggerRaw ?? '(always)'} — ${imp.content.slice(0, 60)}...`
    );
  }

  if (!COMMIT) {
    console.log(
      '\nDry run only. Re-run with --commit to write to the local DB.\n'
    );
    return;
  }

  const db = drizzle(requireLocalDatabaseUrl(), { casing: 'snake_case' });

  // Slug is the stable identity used to match a sheet row to its existing DB
  // row on re-import. When two rows produce the same base slug we disambiguate
  // with a hash of the row's own content, so a given practice keeps the same
  // slug regardless of where it sits in the sheet (an order-based -2/-3 suffix
  // would reshuffle identities whenever a same-named row is inserted above).
  const usedSlugs = new Set<string>();
  const stableSlug = (base: string, seed: string): string => {
    const root = base || 'imp';
    if (!usedSlugs.has(root)) {
      usedSlugs.add(root);
      return root;
    }
    const suffix = hash(seed).slice(0, 8);
    let s = `${root}-${suffix}`;
    let n = 2;
    while (usedSlugs.has(s)) {
      s = `${root}-${suffix}-${n}`;
      n += 1;
    }
    usedSlugs.add(s);
    return s;
  };

  let written = 0;
  let embeddings = 0;

  for (const imp of imps) {
    const embedInput = embedText(imp);
    const slug = stableSlug(
      slugify(imp.title ?? imp.tags[0] ?? 'imp'),
      embedInput
    );
    const contentHash = hash(embedInput);
    const fields = {
      title: imp.title,
      tags: imp.tags,
      triggerRaw: imp.triggerRaw,
      content: imp.content,
      sourceContentHash: contentHash,
    };

    const [existing] = await db
      .select()
      .from(generalImp)
      .where(eq(generalImp.slug, slug))
      .limit(1);

    // Wrap the knowledge_article + general_imp writes in a single transaction
    // so a mid-row failure can't leave an orphan knowledge_article row (the
    // prune step only reaches knowledge rows still owned by a general_imp).
    if (existing) {
      const needsReembed = existing.sourceContentHash !== contentHash;
      const embedding = needsReembed ? await embed(embedInput) : null;
      await db.transaction(async (tx) => {
        if (embedding) {
          await tx
            .update(knowledgeArticle)
            .set({ embedding })
            .where(eq(knowledgeArticle.id, existing.knowledgeArticleId));
        }
        await tx
          .update(generalImp)
          .set(fields)
          .where(eq(generalImp.id, existing.id));
      });
      if (needsReembed) embeddings += 1;
    } else {
      const embedding = await embed(embedInput);
      await db.transaction(async (tx) => {
        const [k] = await tx
          .insert(knowledgeArticle)
          .values({ embedding })
          .returning({ id: knowledgeArticle.id });
        await tx
          .insert(generalImp)
          .values({ knowledgeArticleId: k.id, slug, ...fields });
      });
      embeddings += 1;
    }
    written += 1;
  }

  // ---- prune stale rows (the sheet is the source of truth) ----------------
  let pruned = 0;
  const keptSlugs = Array.from(usedSlugs);
  if (keptSlugs.length > 0) {
    const stale = await db
      .select({ kId: generalImp.knowledgeArticleId })
      .from(generalImp)
      .where(notInArray(generalImp.slug, keptSlugs));
    const staleIds = stale.map((r) => r.kId);
    if (staleIds.length > 0) {
      await db
        .delete(knowledgeArticle)
        .where(inArray(knowledgeArticle.id, staleIds));
      pruned = staleIds.length;
    }
  }

  console.log(
    `\nCommitted: ${written} IMPs, ${embeddings} embeddings, ` +
      `${pruned} stale rows pruned.\n`
  );
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
