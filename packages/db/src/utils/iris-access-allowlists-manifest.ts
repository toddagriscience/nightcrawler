// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  ADVISOR_NOTE_FIELD_LABELS,
  FARM_ANSWER_COLUMNS,
  FARM_CERTIFICATE_ANSWER_COLUMNS,
  FARM_INFO_JSONB_COLUMNS,
  FARM_INFO_SCALAR_COLUMNS,
  FARM_LOCATION_ANSWER_COLUMNS,
  PREFILL_ANSWER_KEYS,
} from './iris-access-field-map';

/** CMS `storageTarget` values validated against platform-access allowlists. */
export const FORM_FIELD_STORAGE_TARGETS = [
  'answers_only',
  'prefill',
  'farm',
  'farm_location',
  'farm_certificate',
  'farm_info_internal_application',
  'advisor_notes',
  'retention_consent',
] as const;

/** CMS `storageTarget` union used by Sanity Studio validation. */
export type FormFieldStorageTarget =
  (typeof FORM_FIELD_STORAGE_TARGETS)[number];

/**
 * Read-only allowlists keyed by `storageTarget` for CMS editor validation.
 * Hydration still uses `iris-access-field-map.ts` at runtime.
 */
export const FORM_FIELD_STORAGE_TARGET_ALLOWLISTS: Record<
  Exclude<FormFieldStorageTarget, 'answers_only' | 'retention_consent'>,
  readonly string[]
> = {
  prefill: [...PREFILL_ANSWER_KEYS],
  farm: [...FARM_ANSWER_COLUMNS],
  farm_location: [...FARM_LOCATION_ANSWER_COLUMNS],
  farm_certificate: [...FARM_CERTIFICATE_ANSWER_COLUMNS],
  farm_info_internal_application: [
    ...FARM_INFO_SCALAR_COLUMNS,
    ...FARM_INFO_JSONB_COLUMNS,
  ],
  advisor_notes: Object.keys(ADVISOR_NOTE_FIELD_LABELS),
};

/**
 * Returns true when a flat answer key prefixes a known JSONB column
 * (e.g. `alternateFarming_no` → `alternateFarming`).
 *
 * @param fieldKey - Sanity checkbox option key
 */
export function isPrefixedFarmInfoJsonbAnswerKey(fieldKey: string): boolean {
  for (const column of FARM_INFO_JSONB_COLUMNS) {
    const prefix = `${column}_`;
    if (fieldKey.startsWith(prefix) && fieldKey.length > prefix.length) {
      return true;
    }
  }

  return false;
}

/**
 * Returns whether a field key is allowed for the given CMS storage target.
 *
 * @param storageTarget - CMS storage destination
 * @param fieldKey - Sanity field or checkbox option key
 */
export function isKeyAllowedForStorageTarget(
  storageTarget: FormFieldStorageTarget,
  fieldKey: string
): boolean {
  if (
    storageTarget === 'answers_only' ||
    storageTarget === 'retention_consent'
  ) {
    return true;
  }

  const allowlist = FORM_FIELD_STORAGE_TARGET_ALLOWLISTS[storageTarget];

  if (allowlist.includes(fieldKey)) {
    return true;
  }

  if (
    storageTarget === 'farm_info_internal_application' &&
    isPrefixedFarmInfoJsonbAnswerKey(fieldKey)
  ) {
    return true;
  }

  return false;
}
