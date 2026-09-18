// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PDFDocument, rgb, type PDFPage, type PDFFont } from 'pdf-lib';
import { formatOfferLetterContent } from './format-offer-letter';
import type { OfferLetterFonts } from './fonts';
import type { OfferLetterInput } from './types';

const PAGE_HEIGHT = 792;
const BODY_SIZE = 9;
const BLACK = rgb(0, 0, 0);

interface TextPosition {
  x: number;
  top: number;
  size?: number;
  font: PDFFont;
  maxWidth?: number;
  minimumSize?: number;
}

interface TextSegment {
  text: string;
  font: PDFFont;
}

function fitFontSize(
  text: string,
  font: PDFFont,
  preferredSize: number,
  minimumSize: number,
  maxWidth?: number
): number {
  if (!maxWidth) return preferredSize;
  const measured = font.widthOfTextAtSize(text, preferredSize);
  if (measured <= maxWidth) return preferredSize;
  return Math.max(minimumSize, (preferredSize * maxWidth) / measured);
}

function drawTextAtTop(
  page: PDFPage,
  text: string,
  position: TextPosition
): void {
  const size = fitFontSize(
    text,
    position.font,
    position.size ?? BODY_SIZE,
    position.minimumSize ?? 7,
    position.maxWidth
  );
  page.drawText(text, {
    x: position.x,
    y: PAGE_HEIGHT - position.top - size,
    size,
    font: position.font,
    color: BLACK,
  });
}

function drawLinesAtTop(
  page: PDFPage,
  lines: string[],
  position: Omit<TextPosition, 'top'> & { top: number; leading: number }
): void {
  lines.forEach((line, index) =>
    drawTextAtTop(page, line, {
      ...position,
      top: position.top + index * position.leading,
    })
  );
}

function drawSegmentsAtTop(
  page: PDFPage,
  segments: TextSegment[],
  position: Omit<TextPosition, 'font'>
): void {
  const preferredSize = position.size ?? BODY_SIZE;
  const measured = segments.reduce(
    (width, segment) =>
      width + segment.font.widthOfTextAtSize(segment.text, preferredSize),
    0
  );
  const size =
    position.maxWidth && measured > position.maxWidth
      ? Math.max(
          position.minimumSize ?? 7,
          (preferredSize * position.maxWidth) / measured
        )
      : preferredSize;
  let x = position.x;
  for (const segment of segments) {
    page.drawText(segment.text, {
      x,
      y: PAGE_HEIGHT - position.top - size,
      size,
      font: segment.font,
      color: BLACK,
    });
    x += segment.font.widthOfTextAtSize(segment.text, size);
  }
}

/**
 * Draws the dynamic first page of the approved offer packet.
 *
 * @param pdf - Target PDF document
 * @param input - Validated candidate and offer details
 * @param fonts - Embedded packet fonts
 */
export function drawOfferLetterPage(
  pdf: PDFDocument,
  input: OfferLetterInput,
  fonts: OfferLetterFonts
): void {
  const page = pdf.addPage([612, PAGE_HEIGHT]);
  const content = formatOfferLetterContent(input);

  drawTextAtTop(page, 'TODD', {
    x: 42.2,
    top: 34.3,
    size: 26,
    font: fonts.wordmark,
  });
  drawLinesAtTop(
    page,
    [
      'Todd Agriscience, Inc.',
      '200 South Barrington Avenue',
      'Los Angeles, CA 90049',
      'United States',
    ],
    { x: 436, top: 30.2, leading: 15, font: fonts.letter, size: 9 }
  );

  drawTextAtTop(page, content.letterDate, {
    x: 43.6,
    top: 111.1,
    font: fonts.letter,
  });
  drawLinesAtTop(page, [input.name, ...input.addressLines], {
    x: 43.6,
    top: 141.4,
    leading: 15,
    font: fonts.letter,
    maxWidth: 350,
    minimumSize: 7.5,
  });

  drawTextAtTop(page, `Dear ${content.firstName},`, {
    x: 43.6,
    top: 210.7,
    font: fonts.letter,
  });
  drawLinesAtTop(
    page,
    [
      'We are excited to extend an offer to join Todd Agriscience, Inc. (“Todd”). We were impressed with your skills and experience, and',
      'we believe you will be a great addition to our team.',
    ],
    { x: 43.6, top: 238, leading: 15, font: fonts.letter, size: 9 }
  );

  const details = [
    ['Position:', input.position, 289.2],
    ['Start/End Date:', content.dateRange, 315.5],
    ['Location:', input.location, 342.3],
  ] as const;
  for (const [label, value, top] of details) {
    drawTextAtTop(page, label, { x: 43.6, top, font: fonts.bold });
    drawTextAtTop(page, value, {
      x: 185.6,
      top,
      font: fonts.letter,
      maxWidth: 368,
    });
  }

  drawTextAtTop(page, 'Compensation:', {
    x: 43.6,
    top: 369.8,
    font: fonts.bold,
  });
  const compensation = [
    [
      { text: '•  ', font: fonts.letter },
      { text: 'Annual Base Salary:', font: fonts.bold },
      { text: ` ${content.salary}`, font: fonts.letter },
    ],
    [
      { text: '•  ', font: fonts.letter },
      { text: 'Signing Bonus:', font: fonts.bold },
      {
        text: ` ${content.signingBonus} (one-time, subject to applicable tax withholding)`,
        font: fonts.letter,
      },
    ],
    [
      { text: '•  ', font: fonts.letter },
      { text: 'Equity:', font: fonts.bold },
      {
        text: ` ${content.equity} in Todd Agriscience, Inc. (subject to vesting and company terms)`,
        font: fonts.letter,
      },
    ],
    [
      { text: '•  ', font: fonts.letter },
      { text: 'Benefits:', font: fonts.bold },
      {
        text: ' Flexible TO, remote work and travel benefits, and other company benefits',
        font: fonts.letter,
      },
    ],
  ];
  compensation.forEach((segments, index) =>
    drawSegmentsAtTop(page, segments, {
      x: 185.6,
      top: 369.8 + index * 22.2,
      maxWidth: 369,
      minimumSize: 7.2,
    })
  );

  drawLinesAtTop(
    page,
    [
      'Your employment with Todd will be “at will,” meaning that either you or Todd may terminate the employment relationship at any',
      'time, with or without cause or notice.',
    ],
    { x: 43.6, top: 479.9, leading: 15, font: fonts.letter }
  );
  drawLinesAtTop(
    page,
    [
      'This offer is conditioned upon the successful completion of a background check and verification of your eligibility to work in',
      'the United States.',
    ],
    { x: 43.6, top: 524.9, leading: 15, font: fonts.letter }
  );
  drawLinesAtTop(
    page,
    [
      `Please review this offer carefully and sign and date this letter electronically by ${content.acceptByDate} to indicate your acceptance.`,
      'We are excited about the possibility of you joining us to help build the future of agriculture.',
    ],
    {
      x: 43.6,
      top: 569.9,
      leading: 15,
      font: fonts.letter,
      maxWidth: 511,
      minimumSize: 7.5,
    }
  );

  drawTextAtTop(page, 'Welcome to Todd!', {
    x: 43.6,
    top: 614.9,
    font: fonts.letter,
  });
  drawTextAtTop(page, 'Sincerely,', {
    x: 43.6,
    top: 644.9,
    font: fonts.letter,
  });
  drawLinesAtTop(
    page,
    ['Vincent Todd', 'Chief People Officer', 'Todd Agriscience, Inc.'],
    { x: 43.6, top: 674.9, leading: 15, font: fonts.letter }
  );
  drawTextAtTop(
    page,
    'Todd Agriscience, Inc. is an equal opportunity employer. All employment is decided on the basis of qualifications, merit, and business need.',
    { x: 43.6, top: 746.2, size: 7, font: fonts.letter }
  );
}
