// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Normalizes source-file license headers across a codebase.
 *
 * This script scans JavaScript and TypeScript source files and ensures that
 * a standardized license header is present at the top of each file.
 *
 * Behavior:
 * 1. If a file has no leading comment, the license header is prepended.
 * The license text is loaded from a shared license file and applied
 * consistently to all matched source files.
 *
 * Files processed:
 * - JavaScript and TypeScript files (`.js`, `.jsx`, `.ts`, `.tsx`)
 *
 * Files ignored:
 * - `node_modules/**`
 * - TypeScript declaration files (`*.d.ts`)
 *
 * Notes:
 * - The script operates in-place and overwrites files on disk.
 * - Errors during processing will terminate execution with a non-zero exit code.
 *
 */

import { promises as fs } from 'fs';
import { stat } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

const LICENSE_PATH = path.resolve('./license-header.txt');

async function processFile(filePath: string): Promise<void> {
  const original = await fs.readFile(filePath, 'utf8');
  const licenseText = await fs.readFile(LICENSE_PATH, 'utf8');

  const lines = original.split(/\r?\n/);

  const first = lines[0]?.trim() ?? '';
  const hasLeadingComment = first.startsWith('//') || first.startsWith('/*');

  // ---------------------------------------------
  // Case 1 — no comment → prepend license
  // ---------------------------------------------
  if (!hasLeadingComment) {
    await fs.writeFile(filePath, `${licenseText}\n${original}`, 'utf8');
    return;
  }

  // ---------------------------------------------
  // Extract EXACT leading comment block
  // ---------------------------------------------
  const commentLines: string[] = [];
  let index = 0;

  if (first.startsWith('//')) {
    while (index < lines.length && lines[index].trim().startsWith('//')) {
      commentLines.push(lines[index]);
      index++;
    }
  } else {
    while (index < lines.length) {
      commentLines.push(lines[index]);
      if (lines[index].includes('*/')) {
        index++; // past the */
        break;
      }
      index++;
    }
  }

  const commentText = commentLines.join('\n');

  const hasCopyright = /copyright/i.test(commentText);

  // ---------------------------------------------
  // Case 2 — comment exists but NOT a license → prepend license
  // ---------------------------------------------
  if (!hasCopyright) {
    await fs.writeFile(filePath, `${licenseText}\n${original}`, 'utf8');
    return;
  }

  // ---------------------------------------------
  // Case 3 — IS a license → delete copyright block
  // Definition:
  //   - from first line containing "Copyright"
  //   - until a line ending with "*" (ignoring whitespace)
  // ---------------------------------------------

  let start = -1;
  let end = -1;

  // find start index (inside commentLines)
  for (let i = 0; i < commentLines.length; i++) {
    if (/copyright/i.test(commentLines[i])) {
      start = i;
      break;
    }
  }

  if (start === -1) {
    // Fallback: shouldn't happen; treat as no-license
    await fs.writeFile(filePath, `${licenseText}\n${original}`, 'utf8');
    return;
  }

  // find end index — first line whose LAST non-whitespace character is '*'
  for (let i = start; i < commentLines.length; i++) {
    if (/\*\s*$/.test(commentLines[i])) {
      end = i;
      break;
    }
  }

  if (end === -1) {
    // If no closing *, just remove the copyright line alone
    end = start;
  }

  // Remove slice [start, end]
  const cleanedComment = [
    ...commentLines.slice(0, start),
    ...commentLines.slice(end + 1),
  ];

  // Rebuild file
  const output =
    licenseText +
    '\n' +
    cleanedComment.join('\n') +
    '\n' +
    lines.slice(index).join('\n');
  await fs.writeFile(filePath, output, 'utf8');
}

// Main execution
(async () => {
  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', '**/*.d.ts'],
  });

  for (const file of files) {
    const fileStat = await stat(file);
    if (!fileStat.isFile()) continue; // skip directories
    await processFile(file).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }
})();
