// Copyright © Todd Agriscience, Inc. All rights reserved.

/** @fileoverview These functions all check if the input could be a file, string, or null, and parse it accordingly. */

/** Safely parses a JSON string from formData.get(), returning undefined if parsing fails or value is empty.
 *
 * @param {FormDataEntryValue | Null} value - The JSON string
 * @returns {object | undefined} - Either the "cleaned" JSON value or undefined */
export function parseJsonField(
  value: FormDataEntryValue | null
): object | undefined {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

/** Safely parses a string field from formData.get(), returning undefined if empty.
 *
 * @param {FormDataEntryValue | null} value - The string value
 * @returns {string | undefined} - Either the trimmed string or undefined */
export function parseStringField(
  value: FormDataEntryValue | null
): string | undefined {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  return value.trim();
}

/** Safely parses an integer field from formData.get(), returning undefined if invalid.
 *
 * @param {FormDataEntryValue | null} value - The integer string
 * @returns {number | undefined} - Either the parsed integer or undefined */
export function parseIntegerField(
  value: FormDataEntryValue | null
): number | undefined {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/** Safely parses a numeric/decimal field from formData.get(), returning undefined if invalid.
 *
 * @param {FormDataEntryValue | null} value - The numeric string
 * @returns {string | undefined} - Either the trimmed numeric string or undefined */
export function parseNumericField(
  value: FormDataEntryValue | null
): string | undefined {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : value.trim();
}
