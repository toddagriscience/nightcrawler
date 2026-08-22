// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Shared helpers for the spreadsheet -> DB mirror importers
 * (import-general-imps.ts, import-seed-varieties.ts). Keeping the CSV parser,
 * slugifier, embedding pipeline, and localhost guard in one place stops the
 * importers from drifting apart when one is fixed.
 */

import { createHash } from 'node:crypto';
import { getEmbedding } from '../../src/utils/get-embedding';

/** Dimensionality of the pgvector embeddings stored on knowledge_article. */
export const EMBEDDING_DIMENSIONS = 3072;

/** Reads a `--name value` CLI flag from process.argv, or undefined. */
export function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

/**
 * Asserts the target DB is the local Docker instance and returns its
 * connection URL. Importers rebuild whole tables, so they must never point at
 * a shared/remote database.
 *
 * @returns The localhost postgres connection URL
 * @throws If LOCAL_DATABASE_HOST is not localhost / 127.0.0.1
 */
export function requireLocalDatabaseUrl(): string {
  const host = process.env.LOCAL_DATABASE_HOST ?? '';
  if (!['localhost', '127.0.0.1'].includes(host)) {
    throw new Error(
      `Refusing to run: LOCAL_DATABASE_HOST is "${host}", expected localhost. ` +
        'This importer only runs against the local Docker DB.'
    );
  }
  return (
    `postgresql://${encodeURIComponent(process.env.LOCAL_DATABASE_USER ?? 'postgres')}` +
    `:${encodeURIComponent(process.env.LOCAL_DATABASE_PASSWORD ?? '')}` +
    `@${host}:${process.env.LOCAL_DATABASE_PORT ?? '5432'}` +
    `/${process.env.LOCAL_DATABASE_DATABASE ?? 'postgres'}`
  );
}

/** Minimal RFC-4180 CSV parser (quotes, commas, embedded newlines). */
export function parseCsv(text: string): string[][] {
  // Normalize CRLF (and lone CR) to LF up front so quoted multi-line cells
  // hash identically whether the sheet was exported on Windows or elsewhere;
  // otherwise a stray \r inside a cell triggers a needless re-embed.
  const input = text.replace(/\r\n?/g, '\n');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];
    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') {
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
    } else if (c === '\n') {
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

/** Lowercase, ASCII-fold, and hyphenate a string into a URL-safe slug. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** SHA-256 hex digest, used as the source-content fingerprint. */
export function hash(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

/**
 * Seeded deterministic pseudo-embedding for local runs without an OpenAI key.
 * These are NOT semantically meaningful — they only let the importer populate
 * the column so the app renders. See {@link embed}.
 */
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

let warnedAboutFakeEmbeddings = false;

/**
 * Returns a real OpenAI embedding when OPENAI_EMBEDDINGS_KEY is set, otherwise
 * a deterministic placeholder. Warns loudly (once) on the fallback so a
 * `--commit` run without the key does not silently poison semantic search.
 *
 * @param text - Text to embed
 * @returns The embedding vector
 */
export async function embed(text: string): Promise<number[]> {
  if (!process.env.OPENAI_EMBEDDINGS_KEY) {
    if (!warnedAboutFakeEmbeddings) {
      warnedAboutFakeEmbeddings = true;
      console.warn(
        '⚠️  OPENAI_EMBEDDINGS_KEY is not set — writing DETERMINISTIC PLACEHOLDER ' +
          'embeddings. Semantic search over these rows will return meaningless ' +
          'neighbors. Set the key and re-run to generate real embeddings.'
      );
    }
    return deterministicEmbedding(text);
  }
  return getEmbedding(text);
}
