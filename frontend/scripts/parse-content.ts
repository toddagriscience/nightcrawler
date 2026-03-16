// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * CLI script for the content-to-markdown parser (Parser 2).
 *
 * Parses images, PDFs, Excel files, or plain text into clean markdown.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/parse-content.ts <filepath> [options]
 *
 * Options:
 *   --sheet <name>    Use a specific sheet (Excel only)
 *   --output <path>   Write output to a file instead of stdout
 *   --save            Store parsed content in the knowledge base (requires DB)
 *   --category <cat>  Knowledge base category (required with --save)
 *                     One of: soil, planting, water, insects_disease,
 *                     harvest_storage, go_to_market, seed_products
 *   --source <src>    Source attribution for knowledge base entries
 *
 * Examples:
 *   bun run scripts/parse-content.ts photo-of-guide.jpg
 *   bun run scripts/parse-content.ts produce-safety.pdf --output output.md
 *   bun run scripts/parse-content.ts imps.xlsx --sheet "IMP"
 *   bun run scripts/parse-content.ts guide.png --save --category soil --source "Todd Field Guide"
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseContent, parseExcelContent } from '@/lib/ai/content-parser';

// ---------------------------------------------------------------------------
// Valid knowledge base categories
// ---------------------------------------------------------------------------

const VALID_CATEGORIES = [
  'soil',
  'planting',
  'water',
  'insects_disease',
  'harvest_storage',
  'go_to_market',
  'seed_products',
] as const;

type KnowledgeCategory = (typeof VALID_CATEGORIES)[number];

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  filePath: string;
  sheet?: string;
  outputPath?: string;
  save: boolean;
  category?: KnowledgeCategory;
  source?: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  let filePath: string | null = null;
  let sheet: string | undefined;
  let outputPath: string | undefined;
  let save = false;
  let category: KnowledgeCategory | undefined;
  let source: string | undefined;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--sheet':
        sheet = args[++i];
        break;
      case '--output':
        outputPath = args[++i];
        break;
      case '--save':
        save = true;
        break;
      case '--category':
        category = args[++i] as KnowledgeCategory;
        break;
      case '--source':
        source = args[++i];
        break;
      default:
        if (!args[i].startsWith('--')) {
          filePath = args[i];
        }
    }
  }

  if (!filePath) {
    console.error(
      'Usage: bun run scripts/parse-content.ts <filepath> [options]\n\n' +
        'Options:\n' +
        '  --sheet <name>      Sheet name (Excel only)\n' +
        '  --output <path>     Write output to file\n' +
        '  --save              Store in knowledge base\n' +
        '  --category <cat>    Knowledge category (with --save)\n' +
        '  --source <src>      Source attribution (with --save)'
    );
    process.exit(1);
  }

  if (save && !category) {
    console.error(
      'Error: --category is required when using --save.\n' +
        `Valid categories: ${VALID_CATEGORIES.join(', ')}`
    );
    process.exit(1);
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    console.error(
      `Error: Invalid category "${category}".\n` +
        `Valid categories: ${VALID_CATEGORIES.join(', ')}`
    );
    process.exit(1);
  }

  return { filePath, sheet, outputPath, save, category, source };
}

// ---------------------------------------------------------------------------
// Knowledge base storage
// ---------------------------------------------------------------------------

async function saveToKnowledgeBase(
  markdownContent: string,
  category: KnowledgeCategory,
  source: string,
  title: string
) {
  // Dynamic imports to avoid loading DB/AI deps unless --save is used
  const { db } = await import('@/lib/db/schema/connection');
  const { knowledgeArticle } = await import('@/lib/db/schema');
  const { getEmbedding } = await import('@/lib/ai/embeddings');

  console.log(`  Embedding: "${title}"...`);
  const embedding = await getEmbedding(title + ' ' + markdownContent);

  await db.insert(knowledgeArticle).values({
    title,
    content: markdownContent,
    category,
    source,
    embedding,
  });

  console.log(`  ✓ Saved to knowledge base: "${title}"`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();
  const resolved = path.resolve(args.filePath);
  const ext = path.extname(resolved).toLowerCase();

  console.log(`\nFile: ${resolved}`);
  console.log(`Type: ${ext || 'unknown'}\n`);

  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`);
    process.exit(1);
  }

  let result: string | string[];

  // Use sheet-specific parsing for Excel with --sheet flag
  if (args.sheet && ['.xlsx', '.xls', '.csv'].includes(ext)) {
    console.log(`Sheet: ${args.sheet}\n`);
    result = await parseExcelContent(resolved, args.sheet);
  } else {
    result = await parseContent(resolved);
  }

  // Format output
  const items = Array.isArray(result) ? result : [result];
  const combined = items.join('\n\n---\n\n');

  console.log(`Parsed ${items.length} section(s).\n`);

  // Write to file or stdout
  if (args.outputPath) {
    const outResolved = path.resolve(args.outputPath);
    fs.writeFileSync(outResolved, combined, 'utf-8');
    console.log(`Written to: ${outResolved}\n`);
  } else {
    console.log('--- OUTPUT START ---\n');
    console.log(combined);
    console.log('\n--- OUTPUT END ---');
  }

  // Optionally save to knowledge base
  if (args.save && args.category) {
    const source = args.source ?? path.basename(resolved);
    console.log(`\nSaving to knowledge base (category: ${args.category})...`);

    for (let i = 0; i < items.length; i++) {
      const content = items[i];
      // Extract title from first heading or use filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title =
        titleMatch?.[1] ??
        `${path.basename(resolved, ext)}${items.length > 1 ? ` (${i + 1})` : ''}`;

      await saveToKnowledgeBase(content, args.category, source, title);
    }

    console.log(`\nDone — saved ${items.length} article(s) to knowledge base.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
