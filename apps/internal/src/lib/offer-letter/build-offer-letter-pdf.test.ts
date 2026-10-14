// Copyright © Todd Agriscience, Inc. All rights reserved.

// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { PDFDict, PDFDocument, PDFName } from 'pdf-lib';
import { buildOfferLetterPdf } from './build-offer-letter-pdf';

describe('buildOfferLetterPdf', () => {
  it('builds a non-fillable ten-page US Letter packet', async () => {
    const bytes = await buildOfferLetterPdf({
      name: 'Casey Example',
      position: 'Field Researcher',
      addressLines: ['100 Example Avenue', 'Exampleville, California 12345'],
      letterDate: '2032-04-05',
      acceptByDate: '2032-04-12',
      startDate: '2032-05-03',
      endDate: '2032-09-30',
      location: 'Los Angeles, CA/Remote',
      annualBaseSalary: 0,
      signingBonus: 0,
      equityPercentage: 0,
    });
    const pdf = await PDFDocument.load(bytes);
    const letterFonts = pdf
      .getPage(0)
      .node.Resources()!
      .lookup(PDFName.of('Font'), PDFDict)!
      .entries()
      .map(([, font]) =>
        pdf.context
          .lookup(font, PDFDict)
          .lookup(PDFName.of('BaseFont'), PDFName)
          .toString()
      );
    const legalFonts = pdf
      .getPage(2)
      .node.Resources()!
      .lookup(PDFName.of('Font'), PDFDict)!
      .entries()
      .map(([, font]) =>
        pdf.context
          .lookup(font, PDFDict)
          .lookup(PDFName.of('BaseFont'), PDFName)
          .toString()
      );

    expect(pdf.getTitle()).toBe('Casey Example Packet');
    expect(pdf.getAuthor()).toBe('Todd Agriscience, Inc.');
    expect(pdf.getPages()).toHaveLength(10);
    for (const page of pdf.getPages()) {
      expect(page.getSize()).toEqual({ width: 612, height: 792 });
    }
    expect(pdf.getPage(1).node.get(PDFName.of('Contents'))).toBeDefined();
    expect(pdf.catalog.get(PDFName.of('AcroForm'))).toBeUndefined();
    expect(letterFonts).toContain('/Helvetica');
    expect(legalFonts.some((font) => /NeueHaasUnica/i.test(font))).toBe(true);
  });
});
