// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';
import { US_STATE_CODES } from './us-states';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ZIP = /^\d{5}(-\d{4})?$/;

/** Default work location used when the form location is blank. */
export const DEFAULT_OFFER_LOCATION = 'Los Angeles, CA/Remote';

/** Returns today's date in the current runtime's local timezone. */
export function getCurrentIsoDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function requiredText(label: string, maxLength: number) {
  return z
    .string()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer`)
    .refine((value) => value.trim().length > 0, `${label} is required`);
}

const calendarDate = z
  .string()
  .refine(
    (value) => value === '' || isCalendarDate(value),
    'Enter a valid date'
  );

/** Shared client/server validation schema for offer packet inputs. */
export const offerLetterSchema = z
  .object({
    name: requiredText('Candidate name', 80),
    position: requiredText('Position', 80),
    address: z.object({
      street: requiredText('Street address', 100),
      line2: z
        .string()
        .max(80, 'Address line 2 must be 80 characters or fewer'),
      city: requiredText('City', 60),
      state: z
        .string()
        .refine((value) => US_STATE_CODES.has(value), 'Select a valid state'),
      zip: z.string().regex(ZIP, 'Use 12345 or 12345-6789'),
    }),
    letterDate: calendarDate,
    acceptByDate: calendarDate,
    startDate: calendarDate,
    endDate: calendarDate,
    location: z.string().max(80, 'Location must be 80 characters or fewer'),
    annualBaseSalary: z
      .number({ error: 'Enter an annual base salary' })
      .int('Use whole dollars')
      .nonnegative('Must be 0 or more')
      .max(Number.MAX_SAFE_INTEGER, 'Amount is too large'),
    signingBonus: z
      .number({ error: 'Enter a signing bonus' })
      .int('Use whole dollars')
      .nonnegative('Must be 0 or more')
      .max(Number.MAX_SAFE_INTEGER, 'Amount is too large'),
    equityPercentage: z
      .number({ error: 'Enter an equity percentage' })
      .finite()
      .min(0, 'Must be 0 or more')
      .max(100, 'Must be 100 or less'),
  })
  .superRefine((data, context) => {
    if (
      data.acceptByDate &&
      data.letterDate &&
      data.acceptByDate < data.letterDate
    ) {
      context.addIssue({
        code: 'custom',
        path: ['acceptByDate'],
        message: 'Acceptance date must be on or after the letter date',
      });
    }
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date must be on or after the start date',
      });
    }
  });

/**
 * Parses and normalizes untrusted offer packet input.
 *
 * @param input - Value received by the server action
 * @returns Validated data with surrounding whitespace removed
 */
export function parseOfferLetterFormData(
  input: unknown
): z.infer<typeof offerLetterSchema> {
  const data = offerLetterSchema.parse(input);
  const today = getCurrentIsoDate();
  return {
    ...data,
    name: data.name.trim(),
    position: data.position.trim(),
    letterDate: data.letterDate || today,
    acceptByDate: data.acceptByDate || today,
    startDate: data.startDate || today,
    endDate: data.endDate || today,
    location: data.location.trim() || DEFAULT_OFFER_LOCATION,
    address: {
      street: data.address.street.trim(),
      line2: data.address.line2.trim(),
      city: data.address.city.trim(),
      state: data.address.state,
      zip: data.address.zip.trim(),
    },
  };
}
