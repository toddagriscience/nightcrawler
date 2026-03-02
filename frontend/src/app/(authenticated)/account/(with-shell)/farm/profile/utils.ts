// Copyright © Todd Agriscience, Inc. All rights reserved.

function toDisplayShortDate(dateValue?: Date | string | null) {
  if (!dateValue) {
    return null;
  }

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    timeZone: 'UTC',
  });
}

export function toCertificationValue(
  isCertified?: boolean | null,
  certifiedDate?: Date | string | null
) {
  if (!isCertified) {
    return 'No';
  }

  const shortDate = toDisplayShortDate(certifiedDate);
  return shortDate ? `Yes, ${shortDate}` : 'Yes';
}
