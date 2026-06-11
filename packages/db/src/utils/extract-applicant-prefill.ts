// Copyright © Todd Agriscience, Inc. All rights reserved.

import { normalizePhoneForUrl } from './normalize-phone';

/** Applicant prefill values extracted from stored form answers. */
export interface ApplicantPrefill {
  /** Applicant first name */
  firstName?: string;
  /** Applicant last name */
  lastName?: string;
  /** Farm or business name */
  farmName?: string;
  /** Applicant email address */
  email?: string;
  /** Applicant phone number */
  phone?: string;
}

/** Minimal CMS field metadata used to normalize stored answers. */
export interface ApplicantPrefillFieldHint {
  /** Stable field key from Sanity */
  name: string;
  /** CMS field type */
  type: string;
}

const FIRST_NAME_KEYS = [
  'firstName',
  'first_name',
  'firstname',
  'givenName',
  'given_name',
];

const LAST_NAME_KEYS = [
  'lastName',
  'last_name',
  'lastname',
  'surname',
  'familyName',
  'family_name',
];

const FARM_NAME_KEYS = [
  'informalName',
  'farmName',
  'farm_name',
  'farm',
  'businessName',
  'business_name',
  'companyName',
  'company_name',
  'organizationName',
  'organization_name',
];

const EMAIL_KEYS = [
  'email',
  'emailAddress',
  'email_address',
  'workEmail',
  'work_email',
  'contactEmail',
  'contact_email',
  'userEmail',
  'user_email',
  'applicantEmail',
  'applicant_email',
  'primaryEmail',
  'primary_email',
];

const PHONE_KEYS = [
  'phone',
  'phoneNumber',
  'phone_number',
  'mobile',
  'mobilePhone',
  'mobile_phone',
  'contactPhone',
  'contact_phone',
];

/**
 * Returns true when a string looks like an email address.
 *
 * @param value - Candidate email string
 */
function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Reads the first non-empty string answer for the given keys.
 *
 * @param answers - Stored submission answers
 * @param keys - Candidate field names in priority order
 */
function readStringAnswer(
  answers: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = answers[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

/**
 * Finds an email answer even when the CMS field is not literally named `email`.
 *
 * @param answers - Stored submission answers
 */
function readEmailAnswer(answers: Record<string, unknown>): string | undefined {
  const direct = readStringAnswer(answers, EMAIL_KEYS);
  if (direct && isLikelyEmail(direct)) {
    return direct;
  }

  for (const [key, value] of Object.entries(answers)) {
    if (!/email/i.test(key)) {
      continue;
    }

    if (typeof value === 'string' && isLikelyEmail(value.trim())) {
      return value.trim();
    }
  }

  for (const value of Object.values(answers)) {
    if (typeof value === 'string' && isLikelyEmail(value.trim())) {
      return value.trim();
    }
  }

  return undefined;
}

/**
 * Extracts signup prefill params from stored CMS form answers.
 *
 * @param answers - Stored submission answers
 */
export function extractApplicantPrefillFromAnswers(
  answers: Record<string, unknown>
): ApplicantPrefill {
  return {
    firstName: readStringAnswer(answers, FIRST_NAME_KEYS),
    lastName: readStringAnswer(answers, LAST_NAME_KEYS),
    farmName: readStringAnswer(answers, FARM_NAME_KEYS),
    email: readEmailAnswer(answers),
    phone: readStringAnswer(answers, PHONE_KEYS),
  };
}

/**
 * Adds canonical signup keys to stored answers using CMS field metadata.
 *
 * @param answers - Stored submission answers
 * @param fields - CMS field definitions for the submitted form
 */
export function enrichStoredAnswersWithSignupPrefill(
  answers: Record<string, unknown>,
  fields: ApplicantPrefillFieldHint[]
): Record<string, unknown> {
  const enriched = { ...answers };

  for (const field of fields) {
    const rawValue = answers[field.name];
    if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
      continue;
    }

    const value = rawValue.trim();

    if (field.type === 'email' && !enriched.email && isLikelyEmail(value)) {
      enriched.email = value;
    }

    if (field.type === 'phone' && !enriched.phone) {
      enriched.phone = value;
    }

    if (/^first.?name$/i.test(field.name) && !enriched.firstName) {
      enriched.firstName = value;
    }

    if (/^last.?name$/i.test(field.name) && !enriched.lastName) {
      enriched.lastName = value;
    }

    if (
      (/(farm|business|company|organization).?name$/i.test(field.name) ||
        /^informalName$/i.test(field.name)) &&
      !enriched.farmName
    ) {
      enriched.farmName = value;
    }
  }

  const canonical = extractApplicantPrefillFromAnswers(enriched);

  for (const [key, value] of Object.entries(canonical)) {
    if (value !== undefined) {
      enriched[key] = value;
    }
  }

  return enriched;
}

/**
 * Describes why a submission cannot be used for email-based signup.
 *
 * @param answers - Stored submission answers
 */
export function getMissingApplicantEmailMessage(
  answers: Record<string, unknown>
): string {
  const keys = Object.keys(answers).filter((key) => key.trim().length > 0);

  if (keys.length === 0) {
    return 'This submission has no stored answers.';
  }

  const emailLikeKeys = keys.filter((key) => /email/i.test(key));

  if (emailLikeKeys.length > 0) {
    return `No email value was saved for ${emailLikeKeys.join(', ')}. If the field is optional, the applicant must provide an email before approval.`;
  }

  return 'No email field was found in this submission. Add an Email field to the CMS form (any field name is fine) or collect the applicant email another way.';
}

/**
 * Builds a localized signup path for an approved platform-access submission.
 *
 * @param options - Submission id, signup token, and optional locale
 */
export function buildSignupPath(options: {
  applicationId: number;
  signupToken: string;
  locale?: string;
}): string {
  const params = new URLSearchParams();
  params.set('application_id', String(options.applicationId));
  params.set('token', options.signupToken);
  const locale = options.locale ?? 'en';
  return `/${locale}/signup?${params.toString()}`;
}

/**
 * Builds a signup URL for an approved platform-access submission.
 *
 * @param baseUrl - Site origin without trailing slash
 * @param options - Submission id and signup token
 */
export function buildSignupUrl(
  baseUrl: string,
  options: {
    applicationId: number;
    signupToken: string;
    locale?: string;
  }
): string {
  return new URL(buildSignupPath(options), baseUrl).toString();
}
