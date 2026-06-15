// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Imports the Variety Inventory spreadsheet into seed_crop / seed_variety.
 * The spreadsheet is the source of truth; this rebuilds the DB mirror, so it
 * is safe to re-run after every sheet edit.
 *
 * Usage:
 *   1. Google Sheets -> File -> Download -> Comma-separated values (.csv),
 *      save to packages/db/data/variety-inventory.csv
 *   2. Dry run (writes nothing):   tsx scripts/import-seed-varieties.ts
 *   3. Commit to local DB:         tsx scripts/import-seed-varieties.ts --commit
 *
 * Flags:
 *   --file <path>   CSV path (default: data/variety-inventory.csv)
 *   --commit        Actually write to the local DB (otherwise dry-run)
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { knowledgeArticle, seedCrop, seedVariety } from '../src/schema';
import { getEmbedding } from '../src/utils/get-embedding';

const EMBEDDING_DIMENSIONS = 3072;

// ---- CLI args -------------------------------------------------------------
function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const COMMIT = process.argv.includes('--commit');
const CSV_PATH = getArg('file') ?? 'data/variety-inventory.csv';

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

// ---- small helpers --------------------------------------------------------
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
function isNumericCode(s: string): boolean {
  return /^\d+$/.test(s.trim());
}
function priceToCents(s: string): number | null {
  if (!s) return null;
  const m = s.replace(/[$,\s]/g, '').match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!m) return null;
  const dollars = Number(m[1]);
  const cents = m[2] ? Number((m[2] + '00').slice(0, 2)) : 0;
  return dollars * 100 + cents;
}

type Status = 'available' | 'back_order' | 'reference';
function deriveStatus(inventory: string): Status {
  const v = inventory.trim().toLowerCase();
  if (!v || v === 'n/a' || v === 'na') return 'back_order';
  if (v.includes('cultivar')) return 'reference'; // "Cultivar Descrpt."
  if (/\d/.test(v)) return 'available'; // "25 Seeds", "200 Seeds"
  return 'back_order';
}

// ---- classification -------------------------------------------------------
interface ParsedVariety {
  name: string;
  description: string;
  status: Status;
  pricePerOzCents: number | null;
  pricePerLbCents: number | null;
  pricePerPlantCents: number | null;
  inventoryNote: string | null;
  lastProduced: string | null;
  location: string | null;
}
interface ParsedCrop {
  name: string;
  description: string;
  varieties: ParsedVariety[];
}

function classify(rows: string[][]) {
  const crops: ParsedCrop[] = [];
  const orphans: { line: number; cells: string[] }[] = [];
  const notes: { line: number; text: string }[] = [];
  let current: ParsedCrop | null = null;
  const MAX_NAME = 80; // names are short; longer text is a preamble/note
  const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

  for (let r = 1; r < rows.length; r += 1) {
    // row 0 is the header
    const cells = (rows[r] ?? []).map((c) => (c ?? '').trim());
    const col0 = cells[0] ?? '';
    const col1 = cells[1] ?? '';
    const perOz = cells[2] ?? '';
    const perLb = cells[3] ?? '';
    const perPlant = cells[4] ?? '';
    const inventory = cells[5] ?? '';
    const lastProduced = cells[6] ?? '';
    const location = cells[7] ?? '';

    if (cells.every((c) => c === '')) continue;

    const hasDetail = [perOz, perLb, perPlant, inventory, lastProduced, location].some(
      (c) => c !== ''
    );
    const numericCode = isNumericCode(col0);

    // Derive a candidate name + description:
    //  - col0 holds the name when it's a non-numeric label ("MARY WASHINGTON (SEED)")
    //  - otherwise the name is the lead-in of col1 ("LARGE PURPLE SWEET, A plant...")
    let candidateName: string;
    let description: string;
    if (col0 && !numericCode) {
      candidateName = col0;
      description = col1;
    } else if (col1) {
      const comma = col1.indexOf(',');
      if (comma > 0) {
        candidateName = col1.slice(0, comma).trim();
        description = col1.slice(comma + 1).trim();
      } else {
        candidateName = col1;
        description = '';
      }
    } else {
      candidateName = ''; // lone code like "005"
      description = '';
    }

    // A long "name" with no price/inventory is a preamble/instruction paragraph
    // from the source catalog, not a crop or variety — skip it.
    if (!hasDetail && candidateName.length > MAX_NAME) {
      notes.push({ line: r + 1, text: candidateName.slice(0, 60) });
      continue;
    }

    // Crop header: short non-numeric name in col0, no price/inventory detail.
    if (col0 && !numericCode && !hasDetail) {
      current = { name: cap(col0, 200), description: col1, varieties: [] };
      crops.push(current);
      continue;
    }

    // Everything else is a variety, and needs a parent crop.
    if (!current) {
      orphans.push({ line: r + 1, cells });
      continue;
    }

    const name = candidateName || `${current.name}${col0 ? ` ${col0}` : ''}`.trim();
    current.varieties.push({
      name: cap(name || `${current.name} variety`, 200),
      description,
      status: deriveStatus(inventory),
      pricePerOzCents: priceToCents(perOz),
      pricePerLbCents: priceToCents(perLb),
      pricePerPlantCents: priceToCents(perPlant),
      inventoryNote: inventory ? cap(inventory, 200) : null,
      lastProduced: lastProduced ? cap(lastProduced, 50) : null,
      location: location ? cap(location, 200) : null,
    });
  }
  return { crops, orphans, notes };
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

// ---- main -----------------------------------------------------------------
async function main() {
  const csv = readFileSync(CSV_PATH, 'utf8');
  const rows = parseCsv(csv);
  const { crops, orphans, notes } = classify(rows);

  const varietyCount = crops.reduce((n, c) => n + c.varieties.length, 0);
  const statusCounts: Record<Status, number> = {
    available: 0,
    back_order: 0,
    reference: 0,
  };
  for (const c of crops) for (const v of c.varieties) statusCounts[v.status] += 1;

  console.log(`\nParsed ${CSV_PATH}`);
  console.log(`  Crops:     ${crops.length}`);
  console.log(`  Varieties: ${varietyCount}`);
  console.log(
    `  Status:    available=${statusCounts.available} ` +
    `back_order=${statusCounts.back_order} reference=${statusCounts.reference}`
  );
  console.log(`  Orphan/unclassified rows: ${orphans.length}`);
  console.log(`  Skipped note/preamble rows: ${notes.length}`);
  if (orphans.length) {
    console.log('  First 10 orphans (line: cells):');
    for (const o of orphans.slice(0, 10)) {
      console.log(`    ${o.line}: ${JSON.stringify(o.cells)}`);
    }
  }
  console.log('\n  Sample (first 3 crops):');
  for (const c of crops.slice(0, 3)) {
    console.log(
      `    [crop] ${c.name} (${c.varieties.length} varieties) — ` +
      `${c.description.slice(0, 60)}...`
    );
    for (const v of c.varieties.slice(0, 3)) {
      console.log(
        `        [variety] ${v.name} | ${v.status} | ` +
        `oz=${v.pricePerOzCents} lb=${v.pricePerLbCents} plant=${v.pricePerPlantCents} ` +
        `| inv="${v.inventoryNote ?? ''}"`
      );
    }
  }

  if (!COMMIT) {
    console.log('\nDry run only. Re-run with --commit to write to the local DB.\n');
    return;
  }

  const db = drizzle(databaseUrl, { casing: 'snake_case' });
  const usedSlugs = new Set<string>();
  const uniqueSlug = (base: string): string => {
    let s = base || 'item';
    let n = 2;
    while (usedSlugs.has(s)) {
      s = `${base}-${n}`;
      n += 1;
    }
    usedSlugs.add(s);
    return s;
  };

  let cropsWritten = 0;
  let varietiesWritten = 0;
  let embeddings = 0;

  for (const crop of crops) {
    const cropSlug = uniqueSlug(slugify(crop.name));
    const cropText = `${crop.name}\n${crop.description}`;
    const cropHash = hash(cropText);

    const [existing] = await db
      .select()
      .from(seedCrop)
      .where(eq(seedCrop.slug, cropSlug))
      .limit(1);

    let cropId: number;
    if (existing) {
      cropId = existing.id;
      if (existing.sourceContentHash !== cropHash) {
        await db
          .update(knowledgeArticle)
          .set({ embedding: await embed(cropText) })
          .where(eq(knowledgeArticle.id, existing.knowledgeArticleId));
        embeddings += 1;
      }
      await db
        .update(seedCrop)
        .set({ name: crop.name, description: crop.description, sourceContentHash: cropHash })
        .where(eq(seedCrop.id, cropId));
    } else {
      const [k] = await db
        .insert(knowledgeArticle)
        .values({ embedding: await embed(cropText) })
        .returning({ id: knowledgeArticle.id });
      embeddings += 1;
      const [inserted] = await db
        .insert(seedCrop)
        .values({
          knowledgeArticleId: k.id,
          name: crop.name,
          slug: cropSlug,
          description: crop.description,
          sourceContentHash: cropHash,
        })
        .returning({ id: seedCrop.id });
      cropId = inserted.id;
    }
    cropsWritten += 1;

    for (const v of crop.varieties) {
      const vSlug = uniqueSlug(`${cropSlug}-${slugify(v.name)}`);
      const vText = `${crop.name} ${v.name}\n${v.description}`;
      const vHash = hash(vText);
      const fields = {
        seedCropId: cropId,
        name: v.name,
        description: v.description,
        status: v.status,
        pricePerOzCents: v.pricePerOzCents,
        pricePerLbCents: v.pricePerLbCents,
        pricePerPlantCents: v.pricePerPlantCents,
        inventoryNote: v.inventoryNote,
        lastProduced: v.lastProduced,
        location: v.location,
        sourceContentHash: vHash,
      };

      const [existingV] = await db
        .select()
        .from(seedVariety)
        .where(eq(seedVariety.slug, vSlug))
        .limit(1);

      if (existingV) {
        if (existingV.sourceContentHash !== vHash) {
          await db
            .update(knowledgeArticle)
            .set({ embedding: await embed(vText) })
            .where(eq(knowledgeArticle.id, existingV.knowledgeArticleId));
          embeddings += 1;
        }
        await db.update(seedVariety).set(fields).where(eq(seedVariety.id, existingV.id));
      } else {
        const [k] = await db
          .insert(knowledgeArticle)
          .values({ embedding: await embed(vText) })
          .returning({ id: knowledgeArticle.id });
        embeddings += 1;
        await db.insert(seedVariety).values({ knowledgeArticleId: k.id, slug: vSlug, ...fields });
      }
      varietiesWritten += 1;
    }
  }

  console.log(
    `\nCommitted: ${cropsWritten} crops, ${varietiesWritten} varieties, ` +
    `${embeddings} embeddings generated.\n`
  );
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
