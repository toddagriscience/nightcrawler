// Copyright © Todd Agriscience, Inc. All rights reserved.

export const NOT_SET = 'Not set';

type MailingAddressLocation = {
  address1: string | null;
  address2: string | null;
  address3: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
};

export function toDisplayValue(value?: string | null) {
  return value?.trim() || NOT_SET;
}

/**
 * Narrows an account display value to an address that can back a `mailto:`
 * link. The account loaders normalise absent values to `NOT_SET`, but callers
 * pass plain strings, so anything that is not a plausible address (empty,
 * whitespace, a placeholder such as `'N/A'`) must not be linkified — a
 * `mailto:` with no address is a dead link.
 *
 * @param value - Display value for an email address
 * @returns The trimmed address, or `null` when it is not mailable
 */
export function toMailtoAddress(value: string): string | null {
  const address = value.trim();

  if (address === NOT_SET || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    return null;
  }

  return address;
}

/**
 * Narrows an account display value to the digits that can back a `tel:` link,
 * stripping presentation characters and keeping a leading `+`. Same contract
 * as {@link toMailtoAddress}: a value with too few digits to dial (empty, or a
 * placeholder such as `'N/A'`) yields `null` rather than an empty `tel:`.
 *
 * @param value - Display value for a phone number
 * @returns The dialable number, or `null` when it is not dialable
 */
export function toTelNumber(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed === NOT_SET) {
    return null;
  }

  const dialable = trimmed.replace(/[^\d+]/g, '');

  return dialable.replace(/\D/g, '').length >= 7 ? dialable : null;
}

export function toDisplayName(
  firstName?: string | null,
  lastName?: string | null
) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  return fullName || NOT_SET;
}

export function toDisplayDate(dateValue?: Date | string | null) {
  if (!dateValue) {
    return NOT_SET;
  }

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) {
    return NOT_SET;
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatPhysicalLocation(
  pointValue: [number, number] | null,
  countyState?: string | null
) {
  if (!pointValue && !countyState) {
    return NOT_SET;
  }

  const [longitude, latitude] = pointValue ?? [null, null];
  const coordinatePart =
    latitude != null && longitude != null
      ? `${latitude.toFixed(3)},${longitude.toFixed(3)}`
      : '';

  return (
    [coordinatePart, countyState].filter(Boolean).join(' ').trim() || NOT_SET
  );
}

export function formatMailingAddress(location?: MailingAddressLocation) {
  if (!location) {
    return NOT_SET;
  }

  const addressParts = [
    location.address1,
    location.address2,
    location.address3,
    location.state,
    location.postalCode,
    location.country,
  ].filter(Boolean);

  return addressParts.join(' ').trim() || NOT_SET;
}
