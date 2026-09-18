// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { OfferLetterInput } from './types';

const number = new Intl.NumberFormat('en-US');
const percentage = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 4,
});

function formatDate(isoDate: string, month: 'long' | 'short'): string {
  const [year, monthNumber, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, monthNumber - 1, day)).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month,
      day: 'numeric',
      timeZone: 'UTC',
    }
  );
}

/** Prepared text inserted into the dynamic offer page. */
export interface OfferLetterContent {
  /** Abbreviated date used at the top of the letter. */
  letterDate: string;
  /** Candidate first name used in the greeting. */
  firstName: string;
  /** Full start/end date range. */
  dateRange: string;
  /** Annual salary text. */
  salary: string;
  /** Signing bonus text. */
  signingBonus: string;
  /** Equity grant text. */
  equity: string;
  /** Full offer acceptance deadline. */
  acceptByDate: string;
}

/**
 * Formats dynamic offer values exactly as shown in the approved packet.
 *
 * @param input - Validated offer packet data
 * @returns Display-ready strings for the cover page
 */
export function formatOfferLetterContent(
  input: OfferLetterInput
): OfferLetterContent {
  return {
    letterDate: formatDate(input.letterDate, 'short'),
    firstName: input.name.trim().split(/\s+/)[0],
    dateRange: `${formatDate(input.startDate, 'long')}/${formatDate(input.endDate, 'long')}`,
    salary: `USD ${number.format(input.annualBaseSalary)}`,
    signingBonus: `USD ${number.format(input.signingBonus)}`,
    equity: `${percentage.format(input.equityPercentage)}%`,
    acceptByDate: formatDate(input.acceptByDate, 'long'),
  };
}
