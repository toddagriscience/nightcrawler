// Copyright © Todd Agriscience, Inc. All rights reserved.

import { extractApplicantPrefillFromAnswers } from './extract-applicant-prefill';
import {
  ADVISOR_NOTE_FIELD_LABELS,
  FARM_ANSWER_COLUMNS,
  FARM_CERTIFICATE_ANSWER_COLUMNS,
  FARM_INFO_JSONB_COLUMNS,
  FARM_INFO_SCALAR_COLUMNS,
  FARM_LOCATION_ANSWER_COLUMNS,
  PREFILL_ANSWER_KEYS,
  SKIP_ANSWER_KEYS,
} from './iris-access-field-map';
import {
  formSlugHydratesFarmRecords,
  mapFormSubmissionAnswersToFarmRecords,
} from './map-form-submission-answers-to-farm-records';

/** When a mapped value is written relative to the platform-access workflow. */
export type HydrationPreviewTiming =
  | 'on_submit'
  | 'on_signup_prefill'
  | 'on_signup_hydration'
  | 'not_hydrated';

/** One row in the internal dashboard hydration preview table. */
export interface FormSubmissionHydrationPreviewRow {
  /** Answer key(s) from `form_submissions.answers` */
  sourceKeys: string;
  /** Postgres table name */
  table: string;
  /** Postgres column name (snake_case) */
  column: string;
  /** Value that would be written */
  value: unknown;
  /** Workflow stage when this row is persisted */
  when: HydrationPreviewTiming;
}

/** Full hydration preview for one CMS form submission. */
export interface FormSubmissionHydrationPreview {
  /** Whether this form slug participates in farm hydration */
  hydratesFarm: boolean;
  /** Flattened destination rows for the technical DB preview */
  rows: FormSubmissionHydrationPreviewRow[];
}

/**
 * Converts a Drizzle camelCase property to a Postgres snake_case column label.
 *
 * @param key - Drizzle property name
 */
export function toPostgresColumnLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * Returns answer keys that contribute to a prefixed JSONB column.
 *
 * @param column - JSONB column name
 * @param answers - Stored submission answers
 */
function getPrefixedJsonbSourceKeys(
  column: string,
  answers: Record<string, unknown>
): string {
  const prefix = `${column}_`;
  return Object.keys(answers)
    .filter((key) => key.startsWith(prefix))
    .join(', ');
}

/**
 * Returns true when an answer key is consumed by signup hydration or prefill.
 *
 * @param key - Answer field key
 * @param answers - Stored submission answers
 */
function isAnswerKeyMapped(
  key: string,
  answers: Record<string, unknown>
): boolean {
  if (PREFILL_ANSWER_KEYS.has(key) || SKIP_ANSWER_KEYS.has(key)) {
    return true;
  }

  if (key in ADVISOR_NOTE_FIELD_LABELS) {
    return (
      answers[key] !== undefined && answers[key] !== null && answers[key] !== ''
    );
  }

  if (
    FARM_ANSWER_COLUMNS.has(key) ||
    FARM_LOCATION_ANSWER_COLUMNS.has(key) ||
    FARM_CERTIFICATE_ANSWER_COLUMNS.has(key) ||
    FARM_INFO_SCALAR_COLUMNS.has(key) ||
    FARM_INFO_JSONB_COLUMNS.has(key)
  ) {
    return true;
  }

  for (const column of FARM_INFO_JSONB_COLUMNS) {
    if (key.startsWith(`${column}_`)) {
      return true;
    }
  }

  return false;
}

/**
 * Builds the internal-dashboard preview of where submission answers land in Postgres.
 * Approve only changes workflow status — farm tables are written on signup completion.
 *
 * @param input - Form slug and stored answers JSON
 */
export function buildFormSubmissionHydrationPreview(input: {
  formSlug: string;
  answers: Record<string, unknown>;
}): FormSubmissionHydrationPreview {
  const answers = input.answers ?? {};
  const hydratesFarm = formSlugHydratesFarmRecords(input.formSlug);
  const rows: FormSubmissionHydrationPreviewRow[] = [];

  for (const [key, value] of Object.entries(answers)) {
    rows.push({
      sourceKeys: key,
      table: 'form_submissions',
      column: 'answers',
      value,
      when: 'on_submit',
    });
  }

  if (!hydratesFarm) {
    return { hydratesFarm, rows };
  }

  const prefill = extractApplicantPrefillFromAnswers(answers);
  const prefillRows: Array<{
    sourceKeys: string;
    column: string;
    value: string | undefined;
  }> = [
    { sourceKeys: 'firstName', column: 'first_name', value: prefill.firstName },
    { sourceKeys: 'lastName', column: 'last_name', value: prefill.lastName },
    { sourceKeys: 'email', column: 'email', value: prefill.email },
    { sourceKeys: 'phone', column: 'phone', value: prefill.phone },
  ];

  for (const row of prefillRows) {
    if (!row.value) {
      continue;
    }

    rows.push({
      sourceKeys: row.sourceKeys,
      table: 'user',
      column: row.column,
      value: row.value,
      when: 'on_signup_prefill',
    });
  }

  if (prefill.farmName) {
    rows.push({
      sourceKeys: 'farmName / businessName',
      table: 'farm',
      column: 'business_name',
      value: prefill.farmName,
      when: 'on_signup_prefill',
    });
  }

  const mapped = mapFormSubmissionAnswersToFarmRecords(input);
  if (!mapped) {
    return { hydratesFarm, rows };
  }

  const bucketTables: Array<{
    table: string;
    bucket: Record<string, unknown>;
  }> = [
    { table: 'farm', bucket: mapped.farm },
    { table: 'farm_location', bucket: mapped.farmLocation },
    { table: 'farm_certificate', bucket: mapped.farmCertificate },
    { table: 'farm_info_internal_application', bucket: mapped.farmInfo },
  ];

  for (const { table, bucket } of bucketTables) {
    for (const [column, value] of Object.entries(bucket)) {
      const sourceKeys = FARM_INFO_JSONB_COLUMNS.has(column)
        ? getPrefixedJsonbSourceKeys(column, answers) || column
        : column;

      rows.push({
        sourceKeys,
        table,
        column: toPostgresColumnLabel(column),
        value,
        when: 'on_signup_hydration',
      });
    }
  }

  if (mapped.advisorNotesMarkdown.length > 0) {
    const advisorSourceKeys = Object.keys(ADVISOR_NOTE_FIELD_LABELS)
      .filter((key) => {
        const value = answers[key];
        return value !== undefined && value !== null && value !== '';
      })
      .join(', ');

    rows.push({
      sourceKeys: advisorSourceKeys,
      table: 'farm',
      column: 'advisor_profile_notes',
      value: mapped.advisorNotesMarkdown,
      when: 'on_signup_hydration',
    });
  }

  for (const key of Object.keys(answers)) {
    if (isAnswerKeyMapped(key, answers)) {
      continue;
    }

    rows.push({
      sourceKeys: key,
      table: 'form_submissions',
      column: 'answers',
      value: answers[key],
      when: 'not_hydrated',
    });
  }

  return { hydratesFarm, rows };
}
