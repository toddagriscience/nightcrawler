// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import logger from '@/lib/logger';
import { requireInternalAccount } from '@/lib/require-internal-account';
import { buildOfferLetterPdf } from '@/lib/offer-letter/build-offer-letter-pdf';
import { US_STATE_CODES } from './us-states';
import type { OfferLetterFormData } from './types';

/** Matches an ISO `YYYY-MM-DD` date as produced by `<input type="date">`. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** US ZIP or ZIP+4 */
const ZIP = /^\d{5}(-\d{4})?$/;

function isAmount(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Generates an offer letter PDF for the given hiree details.
 *
 * Returns the PDF as base64 so the client can build a Blob and trigger a
 * download without a dedicated route handler.
 *
 * @param data - Hiree details from the offer letter form
 * @returns Base64-encoded PDF bytes, or null if generation failed
 * @throws {Error} When the caller is not an active internal account or the input is invalid
 */
export async function generateOfferLetter(
  data: OfferLetterFormData
): Promise<string | null> {
  await requireInternalAccount();

  const name = data.name.trim();
  const position = data.position.trim();
  const street = data.address.street.trim();
  const line2 = data.address.line2.trim();
  const city = data.address.city.trim();
  const state = data.address.state.trim().toUpperCase();
  const zip = data.address.zip.trim();

  if (
    !name ||
    !position ||
    !street ||
    !city ||
    !US_STATE_CODES.has(state) ||
    !ZIP.test(zip) ||
    !ISO_DATE.test(data.startDate) ||
    !ISO_DATE.test(data.endDate) ||
    !isAmount(data.annualBaseSalary) ||
    !isAmount(data.signingBonus) ||
    !isAmount(data.equity)
  ) {
    throw new Error('Invalid offer letter input');
  }
  if (data.endDate < data.startDate) {
    throw new Error('End date must be on or after start date');
  }

  try {
    const bytes = await buildOfferLetterPdf({
      name,
      position,
      addressLines: [street, line2, `${city}, ${state} ${zip}`].filter(Boolean),
      startDate: data.startDate,
      endDate: data.endDate,
      annualBaseSalary: data.annualBaseSalary,
      signingBonus: data.signingBonus,
      equity: data.equity,
    });
    return Buffer.from(bytes).toString('base64');
  } catch (error) {
    logger.error('Failed to generate offer letter:', error);
    return null;
  }
}
