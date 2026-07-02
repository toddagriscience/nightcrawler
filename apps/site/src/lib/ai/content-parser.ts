// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Content-to-Markdown parser (Parser 2).
 *
 * Takes any content (images, PDFs, Excel sheets, plain text) and converts it
 * to clean markdown. One parser, multiple input formats.
 *
 * Supported formats:
 *  - Images (JPG, PNG, WEBP, GIF) → vision AI extracts text/tables
 *  - PDFs → text extraction, with vision AI fallback for scanned pages
 *  - Excel/Spreadsheets → reads cells and formats as markdown
 *  - Plain text → pass-through with minimal formatting
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import OpenAI from 'openai';
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_EMBEDDINGS_KEY ?? 'NOTAKEY',
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const PDF_EXTENSIONS = new Set(['.pdf']);
const EXCEL_EXTENSIONS = new Set(['.xlsx', '.xls', '.csv']);
const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.markdown']);

const VISION_MODEL = 'gpt-4o-mini';

/**
 * Minimum number of characters per PDF page for text extraction to be
 * considered successful. Below this threshold the page is treated as
 * scanned/image-based and sent to vision AI instead.
 */
const MIN_TEXT_CHARS_PER_PAGE = 50;

// ---------------------------------------------------------------------------
// Vision AI helpers
// ---------------------------------------------------------------------------

/**
 * Sends an image buffer to GPT-4o-mini vision and asks it to extract content
 * as clean markdown.
 *
 * @param imageBase64 - Base64-encoded image data
 * @param mimeType - MIME type of the image (e.g. "image/png")
 * @param context - Optional context hint for the AI (e.g. "This is page 3 of a PDF")
 * @returns Markdown string extracted from the image
 */
async function extractMarkdownFromImage(
  imageBase64: string,
  mimeType: string,
  context?: string
): Promise<string> {
  const systemPrompt = `You are a document digitization assistant. Your job is to convert images of physical documents, guides, reference charts, and textbook pages into clean, well-structured markdown.

Rules:
- Preserve ALL text content faithfully — do not summarize or omit anything.
- Convert tables into markdown tables with proper alignment.
- Use appropriate heading levels (# ## ###) based on the document structure.
- Use bullet lists or numbered lists where the original uses them.
- For diagrams or hand-drawn illustrations that cannot be converted to text, insert a note like: *[Diagram: brief description of what it shows]*
- For pH scales, color charts, or visual references, describe them as a table or list.
- Do not add any content that is not in the original image.
- Do not wrap output in a markdown code block — just return the markdown directly.`;

  const userContent: ChatCompletionContentPart[] = [
    {
      type: 'image_url',
      image_url: {
        url: `data:${mimeType};base64,${imageBase64}`,
        detail: 'high',
      },
    },
    {
      type: 'text',
      text: context
        ? `${context}\n\nExtract all text content from this image as clean markdown.`
        : 'Extract all text content from this image as clean markdown.',
    },
  ];

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    max_tokens: 4096,
    temperature: 0,
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Determines the MIME type for a given file extension.
 */
function mimeTypeForExtension(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

// ---------------------------------------------------------------------------
// Image parser
// ---------------------------------------------------------------------------

/**
 * Parses an image file (JPG, PNG, WEBP, GIF) and extracts its content as
 * markdown using GPT-4o-mini vision.
 *
 * @param imagePath - Absolute or relative path to the image file
 * @returns Markdown string extracted from the image
 */
export async function parseImage(imagePath: string): Promise<string> {
  const resolved = path.resolve(imagePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file not found: ${resolved}`);
  }

  const ext = path.extname(resolved).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) {
    throw new Error(
      `Unsupported image format: ${ext}. Supported: ${[...IMAGE_EXTENSIONS].join(', ')}`
    );
  }

  const buffer = fs.readFileSync(resolved);
  const base64 = buffer.toString('base64');
  const mimeType = mimeTypeForExtension(ext);

  return extractMarkdownFromImage(base64, mimeType);
}

// ---------------------------------------------------------------------------
// PDF parser
// ---------------------------------------------------------------------------

/**
 * Parses a PDF file and converts it to markdown.
 *
 * For text-based PDFs, extracts text directly using pdf-parse. For scanned
 * PDFs (pages with very little extractable text), falls back to vision AI
 * on a per-page basis.
 *
 * @param pdfPath - Absolute or relative path to the PDF file
 * @returns Markdown string of the full PDF content
 */
export async function parsePdf(pdfPath: string): Promise<string> {
  const resolved = path.resolve(pdfPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`PDF file not found: ${resolved}`);
  }

  const { PDFParse } = await import('pdf-parse');
  const buffer = fs.readFileSync(resolved);

  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const textResult = await parser.getText();
  await parser.destroy();

  const rawText = textResult.text?.trim() ?? '';
  const pageCount = textResult.total ?? 1;

  // If the total extracted text is substantial, format it as markdown
  if (rawText.length >= MIN_TEXT_CHARS_PER_PAGE * pageCount) {
    return formatTextAsMarkdown(rawText);
  }

  // Sparse text — likely a scanned PDF. We can't easily render PDF pages to
  // images without heavy dependencies (e.g. poppler, pdf2pic). Return
  // whatever text we got with a note about the limitation.
  if (rawText.length > 0) {
    return (
      formatTextAsMarkdown(rawText) +
      '\n\n---\n\n*Note: Some pages in this PDF may contain scanned images. ' +
      'For best results with scanned documents, convert individual pages to ' +
      'images and use the image parser.*'
    );
  }

  return (
    '*This PDF appears to be fully scanned/image-based with no extractable text. ' +
    'Convert pages to images (e.g. using a screenshot tool or PDF-to-image converter) ' +
    'and parse each page individually using the image parser.*'
  );
}

/**
 * Applies basic markdown formatting heuristics to raw extracted PDF text.
 *
 * Detects headings (short all-caps or bold lines), preserves paragraph
 * breaks, and cleans up extra whitespace.
 */
function formatTextAsMarkdown(text: string): string {
  const lines = text.split('\n');
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    // Skip completely empty lines but preserve paragraph breaks
    if (trimmed === '') {
      // Avoid double blank lines
      if (output.length > 0 && output[output.length - 1] !== '') {
        output.push('');
      }
      continue;
    }

    // Detect likely headings: short lines that are ALL CAPS or end with ':'
    // and are followed by longer text
    const isShortLine = trimmed.length < 80;
    const isAllCaps =
      trimmed === trimmed.toUpperCase() &&
      /[A-Z]/.test(trimmed) &&
      trimmed.length > 2;
    const nextLine = i + 1 < lines.length ? lines[i + 1]?.trim() : '';
    const nextIsContent = (nextLine?.length ?? 0) > trimmed.length;

    if (isShortLine && isAllCaps && nextIsContent) {
      // Main heading
      output.push(`## ${titleCase(trimmed)}`);
      output.push('');
    } else {
      output.push(trimmed);
    }
  }

  return output.join('\n').trim();
}

/** Converts an ALL CAPS string to Title Case. */
function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(And|Or|The|A|An|In|On|At|To|For|Of|With)\b/g, (w) =>
      w.toLowerCase()
    );
}

// ---------------------------------------------------------------------------
// Excel/Spreadsheet parser
// ---------------------------------------------------------------------------

/**
 * Parses an Excel file and converts a specified sheet's content to an array
 * of markdown strings (one per logical section or row).
 *
 * For IMP-style sheets (with Category/Trigger/Body columns), each row becomes
 * a separate markdown document. For generic sheets, the entire sheet is
 * converted to a single markdown table.
 *
 * @param filePath - Path to the Excel/CSV file
 * @param sheetName - Name of the sheet to parse (uses first sheet if not found)
 * @returns Array of markdown strings
 */
export async function parseExcelContent(
  filePath: string,
  sheetName?: string
): Promise<string[]> {
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  // xlsx is a CJS module — import dynamically for ESM compat
  const xlsx = await import('xlsx');
  const workbook = xlsx.readFile(resolved, { type: 'file', raw: false });

  // Pick the requested sheet, or fall back to first sheet
  const targetSheet =
    sheetName && workbook.SheetNames.includes(sheetName)
      ? sheetName
      : workbook.SheetNames[0];

  const sheet = workbook.Sheets[targetSheet];
  const rows: Record<string, unknown>[] = xlsx.utils.sheet_to_json(sheet, {
    defval: '',
  });

  if (rows.length === 0) {
    return ['*Empty sheet — no content found.*'];
  }

  const headers = Object.keys(rows[0]);
  const headersLower = headers.map((h) => h.toLowerCase().trim());

  // Detect IMP-style sheets (Category/Trigger/Body columns)
  const hasCategory = headersLower.some(
    (h) => h === 'category' || h === 'categories'
  );
  const hasTrigger = headersLower.some(
    (h) => h === 'trigger' || h === 'triggers'
  );
  const hasBody = headersLower.some(
    (h) => h === 'body' || h === 'content' || h === 'recommendation'
  );

  if (hasCategory && hasTrigger && hasBody) {
    return parseImpSheet(rows, headers);
  }

  // Generic sheet → convert to a single markdown table
  return [convertToMarkdownTable(rows, headers)];
}

/**
 * Converts IMP-style spreadsheet rows (Category/Trigger/Body) into individual
 * markdown documents.
 */
function parseImpSheet(
  rows: Record<string, unknown>[],
  headers: string[]
): string[] {
  // Find the actual header keys (case-insensitive match)
  const catKey = headers.find((h) =>
    ['category', 'categories'].includes(h.toLowerCase().trim())
  )!;
  const trigKey = headers.find((h) =>
    ['trigger', 'triggers'].includes(h.toLowerCase().trim())
  )!;
  const bodyKey = headers.find((h) =>
    ['body', 'content', 'recommendation'].includes(h.toLowerCase().trim())
  )!;

  const results: string[] = [];

  for (const row of rows) {
    const category = String(row[catKey] ?? '').trim();
    const trigger = String(row[trigKey] ?? '').trim();
    const body = String(row[bodyKey] ?? '').trim();

    // Skip empty rows
    if (!body) continue;

    const parts: string[] = [];

    // Build a title from trigger or category
    const title = trigger || category || 'Untitled';
    parts.push(`# ${title}`);
    parts.push('');

    if (category) {
      parts.push(`**Categories:** ${category}`);
      parts.push('');
    }

    if (trigger) {
      parts.push(`**Trigger:** ${trigger}`);
      parts.push('');
    }

    parts.push(body);

    results.push(parts.join('\n'));
  }

  return results;
}

/**
 * Converts a generic array of row objects into a markdown table.
 */
function convertToMarkdownTable(
  rows: Record<string, unknown>[],
  headers: string[]
): string {
  const lines: string[] = [];

  // Header row
  lines.push('| ' + headers.join(' | ') + ' |');
  // Separator row
  lines.push('| ' + headers.map(() => '---').join(' | ') + ' |');

  // Data rows
  for (const row of rows) {
    const cells = headers.map((h) => {
      const val = String(row[h] ?? '').trim();
      // Escape pipe characters in cell content
      return val.replace(/\|/g, '\\|');
    });
    lines.push('| ' + cells.join(' | ') + ' |');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Unified parser
// ---------------------------------------------------------------------------

/**
 * Auto-detects the file type and parses it to markdown.
 *
 * - Images → single markdown string via vision AI
 * - PDFs → single markdown string via text extraction (+ vision fallback)
 * - Excel/CSV → array of markdown strings (one per section/row for IMPs,
 *   or one element for generic sheets)
 * - Text files → single markdown string (pass-through)
 *
 * @param filePath - Path to the file to parse
 * @returns Markdown content — a single string, or an array for spreadsheets
 */
export async function parseContent(
  filePath: string
): Promise<string | string[]> {
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  const ext = path.extname(resolved).toLowerCase();

  if (IMAGE_EXTENSIONS.has(ext)) {
    return parseImage(resolved);
  }

  if (PDF_EXTENSIONS.has(ext)) {
    return parsePdf(resolved);
  }

  if (EXCEL_EXTENSIONS.has(ext)) {
    return parseExcelContent(resolved);
  }

  if (TEXT_EXTENSIONS.has(ext)) {
    const text = fs.readFileSync(resolved, 'utf-8');
    return text.trim();
  }

  throw new Error(
    `Unsupported file type: ${ext}. Supported: ` +
      [
        ...IMAGE_EXTENSIONS,
        ...PDF_EXTENSIONS,
        ...EXCEL_EXTENSIONS,
        ...TEXT_EXTENSIONS,
      ].join(', ')
  );
}
