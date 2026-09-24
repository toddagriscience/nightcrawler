// Copyright © Todd Agriscience, Inc. All rights reserved.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, StandardFonts, type PDFFont } from 'pdf-lib';

/** Fonts embedded in every offer packet. */
export interface OfferLetterFonts {
  /** Viewer-safe font used for the dynamic offer letter page. */
  letter: PDFFont;
  /** Neue Haas Unica body font. */
  regular: PDFFont;
  /** Bold font used for field labels. */
  bold: PDFFont;
  /** Utah WGL Condensed font used for the Todd wordmark. */
  wordmark: PDFFont;
}

async function loadFont(filename: string): Promise<Uint8Array> {
  return readFile(
    path.join(process.cwd(), 'public', 'fonts', 'offer-letter', filename)
  );
}

/**
 * Loads and embeds the brand fonts required by the offer packet.
 *
 * @param pdf - Target PDF document
 * @returns Embedded fonts ready for drawing
 */
export async function embedOfferLetterFonts(
  pdf: PDFDocument
): Promise<OfferLetterFonts> {
  pdf.registerFontkit(fontkit);
  const [regularBytes, wordmarkBytes] = await Promise.all([
    loadFont('NeueHaasUnicaRegular.ttf'),
    loadFont('UtahWGLCondensedBold.ttf'),
  ]);
  const [letter, regular, wordmark, bold] = await Promise.all([
    pdf.embedFont(StandardFonts.Helvetica),
    pdf.embedFont(regularBytes, { subset: true }),
    pdf.embedFont(wordmarkBytes, { subset: true }),
    pdf.embedFont(StandardFonts.HelveticaBold),
  ]);
  return { letter, regular, bold, wordmark };
}
