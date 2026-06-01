// Copyright © Todd Agriscience, Inc. All rights reserved.

import { userInfo } from '@/lib/zod-schemas/onboarding';
import type {
  SanityForm,
  SanityFormField,
  SanityFormFieldType,
  SanityFormFooterCheckbox,
  SanityFormSection,
} from '@/lib/sanity/form-types';
import { SANITY_FORM_FIELD_TYPES } from '@/lib/sanity/form-types';
import z from 'zod';

/** Honeypot field name — must stay out of Sanity definitions. */
export const FORM_HONEYPOT_FIELD = '_hp';

/** Retention consent field name mapped to the Postgres column. */
export const FORM_RETENTION_CONSENT_FIELD = 'retentionConsent';

/** Default width when CMS omits the value. */
const DEFAULT_FORM_FIELD_WIDTH = 'full' as const;

/**
 * Returns footer consent checkboxes configured in Sanity.
 *
 * @param form - CMS form document
 */
export function resolveFormFooterCheckboxes(
  form: SanityForm
): SanityFormFooterCheckbox[] {
  return (form.footerCheckboxes ?? []).filter(
    (checkbox): checkbox is SanityFormFooterCheckbox => checkbox != null
  );
}

/**
 * Returns grouped sections, falling back to a single legacy section when needed.
 *
 * @param form - CMS form document
 */
export function resolveFormSections(form: SanityForm): SanityFormSection[] {
  if (form.sections && form.sections.length > 0) {
    const resolved = form.sections
      .filter((section): section is SanityFormSection => section != null)
      .map((section) => ({
        ...section,
        fields: (section.fields ?? [])
          .filter((field): field is SanityFormField => field != null)
          .map(normalizeFormField),
      }))
      .filter((section) => section.fields.length > 0);

    if (resolved.length > 0) {
      return resolved;
    }
  }

  if (form.fields && form.fields.length > 0) {
    return [
      {
        title: '',
        fields: form.fields
          .filter((field): field is SanityFormField => field != null)
          .map(normalizeFormField),
      },
    ];
  }

  return [];
}

/**
 * Flattens section fields for validation and persistence.
 *
 * @param sections - CMS form sections
 */
export function flattenFormFields(
  sections: SanityFormSection[]
): SanityFormField[] {
  return sections.flatMap((section) => section.fields ?? []);
}

/**
 * Applies layout defaults to one CMS field row.
 *
 * @param field - CMS field row
 */
function normalizeFormField(field: SanityFormField): SanityFormField {
  return {
    ...field,
    width: field.width ?? DEFAULT_FORM_FIELD_WIDTH,
  };
}

/**
 * Returns true when the field type is supported by the dynamic renderer.
 *
 * @param type - Sanity field type string
 */
export function isSupportedFormFieldType(
  type: string
): type is SanityFormFieldType {
  return (SANITY_FORM_FIELD_TYPES as readonly string[]).includes(type);
}

/**
 * Builds a Zod object schema from Sanity form field definitions.
 *
 * @param fields - CMS field rows
 * @param footerCheckboxes - Optional footer consent checkboxes
 * @returns Zod object schema for answers keyed by field name
 */
export function buildFormAnswersSchema(
  fields: SanityFormField[],
  footerCheckboxes: SanityFormFooterCheckbox[] = []
) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (!isSupportedFormFieldType(field.type)) {
      continue;
    }

    shape[field.name] = buildFieldSchema(field);
  }

  for (const checkbox of footerCheckboxes) {
    shape[checkbox.name] = buildFooterCheckboxSchema(checkbox);
  }

  shape[FORM_HONEYPOT_FIELD] = z.literal('').optional();

  return z.object(shape);
}

/**
 * Maps one footer checkbox to a Zod validator.
 *
 * @param checkbox - CMS footer checkbox definition
 */
function buildFooterCheckboxSchema(
  checkbox: SanityFormFooterCheckbox
): z.ZodTypeAny {
  if (checkbox.required) {
    return z.literal(true, {
      message: `${checkbox.label} is required.`,
    });
  }

  return z.boolean().optional();
}

/**
 * Maps one Sanity field to a Zod validator.
 *
 * @param field - CMS field definition
 */
function buildFieldSchema(field: SanityFormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
      schema = z.string().trim().max(500);
      break;
    case 'email':
      schema = userInfo.shape.email;
      break;
    case 'phone':
      schema = userInfo.shape.phone;
      break;
    case 'textarea':
      schema = z.string().trim().max(5000);
      break;
    case 'url':
      schema = z.union([z.literal(''), z.url()]);
      break;
    case 'select': {
      const options = field.options ?? [];
      schema =
        options.length > 0
          ? z.enum(options as [string, ...string[]])
          : z.string();
      break;
    }
    case 'yesNo':
      schema = z.boolean();
      break;
    case 'checkbox':
      schema = z.boolean();
      break;
    default:
      schema = z.unknown();
  }

  if (field.required) {
    if (field.type === 'checkbox') {
      return z.literal(true, {
        message: `${field.label} is required.`,
      });
    }
    if (field.type === 'url') {
      return z.url(`${field.label} must be a valid URL.`);
    }
    if (field.type === 'yesNo') {
      return schema;
    }
    if (schema instanceof z.ZodString) {
      return schema.min(1, `${field.label} is required.`);
    }
    return schema;
  }

  if (field.type === 'url') {
    return z.union([z.literal(''), z.url()]).optional();
  }

  return schema.optional();
}

/**
 * Builds default values for react-hook-form from Sanity fields.
 *
 * @param fields - CMS field rows
 * @param footerCheckboxes - Optional footer consent checkboxes
 */
export function buildFormDefaultValues(
  fields: SanityFormField[],
  footerCheckboxes: SanityFormFooterCheckbox[] = []
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {
    [FORM_HONEYPOT_FIELD]: '',
  };

  for (const field of fields) {
    switch (field.type) {
      case 'checkbox':
        defaults[field.name] = false;
        break;
      case 'yesNo':
        defaults[field.name] = undefined;
        break;
      default:
        defaults[field.name] = '';
    }
  }

  for (const checkbox of footerCheckboxes) {
    defaults[checkbox.name] = false;
  }

  return defaults;
}

/**
 * Reads retention consent from validated submission values.
 *
 * @param values - Validated form values
 */
export function readRetentionConsentFromValues(
  values: Record<string, unknown>
): boolean {
  return values[FORM_RETENTION_CONSENT_FIELD] === true;
}

/**
 * Removes internal-only keys before persisting answers JSON.
 *
 * @param values - Validated form values
 * @param footerCheckboxes - CMS footer checkbox definitions
 */
export function buildStoredFormAnswers(
  values: Record<string, unknown>,
  footerCheckboxes: SanityFormFooterCheckbox[]
): Record<string, unknown> {
  const storedAnswers = { ...values };
  delete storedAnswers[FORM_HONEYPOT_FIELD];

  for (const checkbox of footerCheckboxes) {
    if (checkbox.name === FORM_RETENTION_CONSENT_FIELD) {
      delete storedAnswers[checkbox.name];
    }
  }

  return storedAnswers;
}

export {
  buildIncomingSignupUrl,
  extractApplicantPrefillFromAnswers,
  extractApplicantPrefillFromAnswers as extractSignupPrefillFromAnswers,
} from '@nightcrawler/db/utils/extract-applicant-prefill';
