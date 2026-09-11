// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import logger from '@/lib/logger';
import { requireInternalAccount } from '@/lib/require-internal-account';
import { buildOfferLetterPdf } from '@/lib/offer-letter/build-offer-letter-pdf';
import type { OfferLetterFormData } from './types';

/** Matches an ISO `YYYY-MM-DD` date as produced by `<input type="date">`. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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
  const address = data.address.trim();
  if (
    !name ||
    !address ||
    !ISO_DATE.test(data.startDate) ||
    !ISO_DATE.test(data.endDate)
  ) {
    throw new Error('Invalid offer letter input');
  }
  if (data.endDate < data.startDate) {
    throw new Error('End date must be on or after start date');
  }

  try {
    const bytes = await buildOfferLetterPdf({
      name,
      address,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    return Buffer.from(bytes).toString('base64');
  } catch (error) {
    logger.error('Failed to generate offer letter:', error);
    return null;
  }
}
