// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PDFDocument } from 'pdf-lib';
import { drawLegalPages } from './draw-legal-pages';
import { drawOfferLetterPage } from './draw-offer-letter-page';
import { embedOfferLetterFonts } from './fonts';
import type { OfferLetterInput } from './types';

export type { OfferLetterInput } from './types';

/**
 * Renders the complete ten-page offer packet.
 *
 * @param input - Validated candidate and offer details
 * @returns Encoded PDF bytes
 */
export async function buildOfferLetterPdf(
  input: OfferLetterInput
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${input.name} Packet`);
  pdf.setAuthor('Todd Agriscience, Inc.');
  pdf.setSubject('Employment offer and confidentiality agreement');

  const fonts = await embedOfferLetterFonts(pdf);
  drawOfferLetterPage(pdf, input, fonts);
  const blankPage = pdf.addPage([612, 792]);
  const blankLabel = 'Intentionally Left Blank';
  const blankSize = 10;
  blankPage.drawText(blankLabel, {
    x: (612 - fonts.regular.widthOfTextAtSize(blankLabel, blankSize)) / 2,
    y: 792 - 392.85 - blankSize * 0.66,
    size: blankSize,
    font: fonts.regular,
  });
  drawLegalPages(pdf, fonts.regular);

  return pdf.save();
}
