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
import { createHash } from 'node:crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, inArray, notInArray } from 'drizzle-orm';
import { generalImp, knowledgeArticle } from '../src/schema';
import { getEmbedding } from '../src/utils/get-embedding';

const EMBEDDING_DIMENSIONS = 3072;

// ---- CLI args -------------------------------------------------------------
function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const COMMIT = process.argv.includes('--commit');
const CSV_PATH = getArg('file') ?? 'data/general-imps.csv';

// ---- localhost safety guard ----------------------------------------------
const host = process.env.LOCAL_DATABASE_HOST ?? '';
if (!['localhost', '127.0.0.1'].includes(host)) {
  throw new Error(
    `Refusing to run: LOCAL_DATABASE_HOST is "${host}", expected localhost. ` +
      'This importer only runs against the local Docker DB.'
  );
}
const databaseUrl =
  `postgresql://${encodeURIComponent(process.env.LOCAL_DATABASE_USER ?? 'postgres')}` +
  `:${encodeURIComponent(process.env.LOCAL_DATABASE_PASSWORD ?? '')}` +
  `@${host}:${process.env.LOCAL_DATABASE_PORT ?? '5432'}` +
  `/${process.env.LOCAL_DATABASE_DATABASE ?? 'postgres'}`;

// ---- minimal RFC-4180 CSV parser (quotes, commas, embedded newlines) -----
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---- helpers --------------------------------------------------------------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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

    // Skip blank separator rows and the header row.
    if (!body) continue;
    if (
      category.toLowerCase() === 'category' &&
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

// ---- embeddings -----------------------------------------------------------
function deterministicEmbedding(seedText: string): number[] {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  const values = new Array<number>(EMBEDDING_DIMENSIONS);
  let state = seed || 1;
  for (let i = 0; i < EMBEDDING_DIMENSIONS; i += 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    values[i] = state / 0xffffffff;
  }
  return values;
}
async function embed(text: string): Promise<number[]> {
  if (!process.env.OPENAI_EMBEDDINGS_KEY) return deterministicEmbedding(text);
  return getEmbedding(text);
}
function hash(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}
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

  const db = drizzle(databaseUrl, { casing: 'snake_case' });
  const usedSlugs = new Set<string>();
  const uniqueSlug = (base: string): string => {
    let s = base || 'imp';
    let n = 2;
    while (usedSlugs.has(s)) {
      s = `${base}-${n}`;
      n += 1;
    }
    usedSlugs.add(s);
    return s;
  };

  let written = 0;
  let embeddings = 0;

  for (const imp of imps) {
    const slug = uniqueSlug(slugify(imp.title ?? imp.tags[0] ?? 'imp'));
    const embedInput = embedText(imp);
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

    if (existing) {
      if (existing.sourceContentHash !== contentHash) {
        await db
          .update(knowledgeArticle)
          .set({ embedding: await embed(embedInput) })
          .where(eq(knowledgeArticle.id, existing.knowledgeArticleId));
        embeddings += 1;
      }
      await db
        .update(generalImp)
        .set(fields)
        .where(eq(generalImp.id, existing.id));
    } else {
      const [k] = await db
        .insert(knowledgeArticle)
        .values({ embedding: await embed(embedInput) })
        .returning({ id: knowledgeArticle.id });
      embeddings += 1;
      await db
        .insert(generalImp)
        .values({ knowledgeArticleId: k.id, slug, ...fields });
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
