// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Converts a stored UTC-midnight timestamp into the local day the calendar expects.
 *
 * @param value - The date read from the database.
 * @returns The equivalent day at local midnight.
 */
export function toCalendarDate(value: Date): Date {
  return new Date(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate()
  );
}

/**
 * Converts the local midnight date react-day-picker returns back to UTC midnight
 * so the observed day does not shift for users east of UTC.
 *
 * @param value - The day picked in the calendar.
 * @returns The equivalent day at UTC midnight.
 */
export function fromCalendarDate(value: Date): Date {
  return new Date(
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
  );
}

/**
 * Formats an observation day the way the zone list shows it.
 *
 * @param value - The stored observation day.
 * @returns A label such as "March 20, 2026".
 */
export function formatObservationDate(value: Date): string {
  return toCalendarDate(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
