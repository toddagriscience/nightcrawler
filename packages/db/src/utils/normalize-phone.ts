// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Strips a phone number to 10-digit NANP format for URL query params.
 * Removes formatting and a leading country code (`+1` / `1`).
 *
 * @param phone - Raw phone string from a form answer or user input
 */
export function normalizePhoneForUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }

  return digits;
}
