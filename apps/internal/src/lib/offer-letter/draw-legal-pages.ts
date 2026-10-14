// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PDFDocument, rgb, type PDFFont } from 'pdf-lib';
import { LEGAL_PAGES, type LegalPage, type LegalPageRule } from './legal-pages';

const PAGE_HEIGHT = 792;

/**
 * Resolves an underline endpoint, trimming full-line headings to their text.
 *
 * @param legalPage - Page containing the rule and its matching text line
 * @param rule - Underline coordinates copied from the reference packet
 * @param font - Font used to render the legal page
 * @returns Horizontal endpoint in PDF points
 */
export function resolveLegalRuleEndX(
  legalPage: LegalPage,
  rule: LegalPageRule,
  font: Pick<PDFFont, 'widthOfTextAtSize'>
): number {
  if (!rule.fitToText) return rule.x1;
  const matchingLine = legalPage.lines.find(
    (line) =>
      Math.abs(line.x - rule.x0) < 0.01 &&
      line.top <= rule.top &&
      rule.top - line.top < line.size + 4
  );
  if (!matchingLine) return rule.x1;
  return (
    rule.x0 +
    font.widthOfTextAtSize(matchingLine.text.trimEnd(), matchingLine.size)
  );
}

/**
 * Appends the eight fixed legal pages from the approved packet.
 *
 * @param pdf - Target PDF document
 * @param font - Embedded Neue Haas Unica font
 */
export function drawLegalPages(pdf: PDFDocument, font: PDFFont): void {
  for (const legalPage of LEGAL_PAGES) {
    const page = pdf.addPage([612, PAGE_HEIGHT]);
    for (const line of legalPage.lines) {
      page.drawText(line.text, {
        x: line.x,
        y: PAGE_HEIGHT - line.top - line.size * 0.66,
        size: line.size,
        font,
        color: rgb(0, 0, 0),
      });
    }
    for (const rule of legalPage.rules) {
      page.drawLine({
        start: { x: rule.x0, y: PAGE_HEIGHT - rule.top },
        end: {
          x: resolveLegalRuleEndX(legalPage, rule, font),
          y: PAGE_HEIGHT - rule.top,
        },
        thickness: 0.4,
        color: rgb(0, 0, 0),
      });
    }
  }
}
