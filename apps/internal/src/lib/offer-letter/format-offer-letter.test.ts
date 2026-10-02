// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { formatOfferLetterContent } from './format-offer-letter';
import type { OfferLetterInput } from './types';

const input: OfferLetterInput = {
  name: 'Casey Example',
  position: 'Field Researcher',
  addressLines: ['100 Example Avenue', 'Exampleville, California 12345'],
  letterDate: '2032-04-05',
  acceptByDate: '2032-04-12',
  startDate: '2032-05-03',
  endDate: '2032-09-30',
  location: 'Los Angeles, CA/Remote',
  annualBaseSalary: 100000,
  signingBonus: 5000,
  equityPercentage: 1.125,
};

describe('formatOfferLetterContent', () => {
  it('matches the reference packet date and compensation formats', () => {
    expect(formatOfferLetterContent(input)).toEqual({
      letterDate: 'Apr 5, 2032',
      firstName: 'Casey',
      dateRange: 'May 3, 2032/September 30, 2032',
      salary: 'USD 100,000',
      signingBonus: 'USD 5,000',
      equity: '1.125%',
      acceptByDate: 'April 12, 2032',
    });
  });
});
