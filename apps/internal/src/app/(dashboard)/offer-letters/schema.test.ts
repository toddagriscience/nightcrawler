// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OFFER_LOCATION,
  offerLetterSchema,
  parseOfferLetterFormData,
} from './schema';

const validInput = {
  name: 'Casey Example',
  position: 'Field Researcher',
  address: {
    street: '100 Example Avenue',
    line2: '',
    city: 'Exampleville',
    state: 'CA',
    zip: '12345',
  },
  letterDate: '2028-02-29',
  acceptByDate: '2028-03-01',
  startDate: '2028-03-02',
  endDate: '2028-11-06',
  location: 'Los Angeles, CA/Remote',
  annualBaseSalary: 100000,
  signingBonus: 5000,
  equityPercentage: 1.125,
};

describe('offerLetterSchema', () => {
  it('accepts the complete packet input and an optional blank address line', () => {
    expect(offerLetterSchema.safeParse(validInput).success).toBe(true);
  });

  it('accepts values at the documented text boundaries', () => {
    const result = offerLetterSchema.safeParse({
      ...validInput,
      name: 'N'.repeat(80),
      address: { ...validInput.address, street: 'S'.repeat(100) },
    });
    expect(result.success).toBe(true);
  });

  it('rejects impossible calendar dates and required missing fields', () => {
    expect(
      offerLetterSchema.safeParse({ ...validInput, letterDate: '2027-02-29' })
        .success
    ).toBe(false);
    const { name: _name, ...missingName } = validInput;
    expect(offerLetterSchema.safeParse(missingName).success).toBe(false);
  });

  it('rejects reversed acceptance and employment date ranges', () => {
    expect(
      offerLetterSchema.safeParse({
        ...validInput,
        acceptByDate: '2028-02-28',
      }).success
    ).toBe(false);
    expect(
      offerLetterSchema.safeParse({
        ...validInput,
        endDate: '2028-03-01',
      }).success
    ).toBe(false);
  });

  it('requires whole-dollar compensation and bounded fractional equity', () => {
    expect(
      offerLetterSchema.safeParse({ ...validInput, annualBaseSalary: 10.5 })
        .success
    ).toBe(false);
    expect(
      offerLetterSchema.safeParse({ ...validInput, equityPercentage: 12.3456 })
        .success
    ).toBe(true);
    expect(
      offerLetterSchema.safeParse({ ...validInput, equityPercentage: 100.01 })
        .success
    ).toBe(false);
  });

  it('trims text before server-side PDF generation', () => {
    const parsed = parseOfferLetterFormData({
      ...validInput,
      name: '  Casey Example  ',
      address: { ...validInput.address, line2: '  Suite 200  ' },
    });
    expect(parsed.name).toBe('Casey Example');
    expect(parsed.address.line2).toBe('Suite 200');
  });

  it('defaults blank dates and location before PDF generation', () => {
    const parsed = parseOfferLetterFormData({
      ...validInput,
      letterDate: '',
      acceptByDate: '',
      startDate: '',
      endDate: '',
      location: '   ',
    });

    expect(parsed.letterDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(parsed.acceptByDate).toBe(parsed.letterDate);
    expect(parsed.startDate).toBe(parsed.letterDate);
    expect(parsed.endDate).toBe(parsed.letterDate);
    expect(parsed.location).toBe(DEFAULT_OFFER_LOCATION);
  });
});
