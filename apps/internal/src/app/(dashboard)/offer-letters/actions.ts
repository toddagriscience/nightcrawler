// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import logger from '@/lib/logger';
import { requireInternalAccount } from '@/lib/require-internal-account';
import { buildOfferLetterPdf } from '@/lib/offer-letter/build-offer-letter-pdf';
import { parseOfferLetterFormData } from './schema';
import { getUsStateName } from './us-states';
import type { OfferLetterFormData } from './types';

/**
 * Generates an offer packet PDF for the given candidate details.
 *
 * Returns the PDF as base64 so the client can build a Blob and trigger a
 * download without a dedicated route handler.
 *
 * @param data - Candidate and offer details from the form
 * @returns Base64-encoded PDF bytes, or null if generation failed
 * @throws {Error} When the caller is not an active internal account or the input is invalid
 */
export async function generateOfferLetter(
  data: OfferLetterFormData
): Promise<string | null> {
  await requireInternalAccount();
  const parsed = parseOfferLetterFormData(data);

  try {
    const bytes = await buildOfferLetterPdf({
      name: parsed.name,
      position: parsed.position,
      addressLines: [
        parsed.address.street,
        parsed.address.line2,
        `${parsed.address.city}, ${getUsStateName(parsed.address.state)} ${parsed.address.zip}`,
      ].filter(Boolean),
      letterDate: parsed.letterDate,
      acceptByDate: parsed.acceptByDate,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      location: parsed.location,
      annualBaseSalary: parsed.annualBaseSalary,
      signingBonus: parsed.signingBonus,
      equityPercentage: parsed.equityPercentage,
    });
    return Buffer.from(bytes).toString('base64');
  } catch (error) {
    logger.error('Failed to generate offer packet:', error);
    return null;
  }
}
