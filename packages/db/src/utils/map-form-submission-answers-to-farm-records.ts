// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farm, farmCertificate, farmLocation } from '../schema/farm';
import { farmInfoInternalApplication } from '../schema/internal-application';
import {
  ADVISOR_NOTE_FIELD_LABELS,
  FARM_ANSWER_COLUMNS,
  FARM_CERTIFICATE_ANSWER_COLUMNS,
  FARM_HYDRATION_FORM_SLUGS,
  FARM_INFO_JSONB_COLUMNS,
  FARM_INFO_SCALAR_COLUMNS,
  FARM_LOCATION_ANSWER_COLUMNS,
  PREFILL_ANSWER_KEYS,
  SKIP_ANSWER_KEYS,
} from './iris-access-field-map';

/** Mapped farm table payloads derived from a form submission. */
export interface MappedFormSubmissionFarmRecords {
  /** Partial `farm` update */
  farm: Record<string, unknown>;
  /** Partial `farm_location` insert/update */
  farmLocation: Record<string, unknown>;
  /** Partial `farm_certificate` insert/update */
  farmCertificate: Record<string, unknown>;
  /** Partial `farm_info_internal_application` insert/update */
  farmInfo: Record<string, unknown>;
  /** Markdown advisor notes from textarea fields */
  advisorNotesMarkdown: string;
}

/**
 * Returns true when a form slug participates in farm-table hydration.
 *
 * @param formSlug - Sanity form slug
 */
export function formSlugHydratesFarmRecords(formSlug: string): boolean {
  return (FARM_HYDRATION_FORM_SLUGS as readonly string[]).includes(formSlug);
}

/**
 * Formats one answer value as markdown-safe plain text.
 *
 * @param value - Raw answer value
 */
function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.map((entry) => formatAnswerValue(entry)).join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

/**
 * Builds markdown sections for advisor note fields.
 *
 * @param answers - Stored submission answers
 */
function buildAdvisorNotesMarkdown(answers: Record<string, unknown>): string {
  const sections = Object.entries(ADVISOR_NOTE_FIELD_LABELS)
    .map(([key, label]) => {
      const value = formatAnswerValue(answers[key]);
      if (!value) {
        return null;
      }

      return `## ${label}\n\n${value}`;
    })
    .filter((section): section is string => section !== null);

  if (sections.length === 0) {
    return '';
  }

  return `# Advisor notes\n\n${sections.join('\n\n')}`;
}

/**
 * Assigns one answer entry to the correct mapped table bucket when the key matches a known column.
 *
 * @param key - Answer field key
 * @param value - Answer value
 * @param mapped - Mutable mapped record buckets
 */
function assignAnswerToBucket(
  key: string,
  value: unknown,
  mapped: MappedFormSubmissionFarmRecords
): void {
  if (
    PREFILL_ANSWER_KEYS.has(key) ||
    SKIP_ANSWER_KEYS.has(key) ||
    key in ADVISOR_NOTE_FIELD_LABELS
  ) {
    return;
  }

  if (FARM_ANSWER_COLUMNS.has(key)) {
    mapped.farm[key] = value;
    return;
  }

  if (FARM_LOCATION_ANSWER_COLUMNS.has(key)) {
    mapped.farmLocation[key] = value;
    return;
  }

  if (FARM_CERTIFICATE_ANSWER_COLUMNS.has(key)) {
    mapped.farmCertificate[key] = value;
    return;
  }

  if (FARM_INFO_SCALAR_COLUMNS.has(key)) {
    mapped.farmInfo[key] = value;
    return;
  }

  if (FARM_INFO_JSONB_COLUMNS.has(key)) {
    if (value !== null && typeof value === 'object') {
      mapped.farmInfo[key] = value;
      return;
    }

    if (typeof value === 'boolean') {
      mapped.farmInfo[key] = value;
    }
  }
}

/**
 * Assembles JSONB objects from prefixed checkbox keys (e.g. `splitOperation_organicAndConventional`).
 *
 * @param answers - Stored submission answers
 * @param mapped - Mutable mapped record buckets
 */
function assignPrefixedJsonbAnswers(
  answers: Record<string, unknown>,
  mapped: MappedFormSubmissionFarmRecords
): void {
  for (const jsonbColumn of FARM_INFO_JSONB_COLUMNS) {
    const prefix = `${jsonbColumn}_`;
    const nested: Record<string, unknown> = {};
    let found = false;

    for (const [key, value] of Object.entries(answers)) {
      if (!key.startsWith(prefix)) {
        continue;
      }

      const nestedKey = key.slice(prefix.length);
      if (!nestedKey) {
        continue;
      }

      nested[nestedKey] = value;
      found = true;
    }

    if (found) {
      mapped.farmInfo[jsonbColumn] = nested;
    }
  }
}

/**
 * Maps stored CMS form answers into farm-related table payloads.
 *
 * @param input - Form slug and stored answers
 */
export function mapFormSubmissionAnswersToFarmRecords(input: {
  formSlug: string;
  answers: Record<string, unknown>;
}): MappedFormSubmissionFarmRecords | null {
  if (!formSlugHydratesFarmRecords(input.formSlug)) {
    return null;
  }

  const mapped: MappedFormSubmissionFarmRecords = {
    farm: {},
    farmLocation: {},
    farmCertificate: {},
    farmInfo: {},
    advisorNotesMarkdown: buildAdvisorNotesMarkdown(input.answers),
  };

  for (const [key, value] of Object.entries(input.answers)) {
    assignAnswerToBucket(key, value, mapped);
  }

  assignPrefixedJsonbAnswers(input.answers, mapped);

  return mapped;
}
