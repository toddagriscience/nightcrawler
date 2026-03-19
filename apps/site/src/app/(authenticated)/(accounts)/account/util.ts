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
