// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Sanity form workflow type copied into Postgres on submit. */
export type SanityFormWorkflowType = 'generic' | 'platform_access';

/** Whitelisted Sanity form field types rendered on `/forms/[slug]`. */
export const SANITY_FORM_FIELD_TYPES = [
  'text',
  'email',
  'phone',
  'textarea',
  'url',
  'select',
  'yesNo',
  'checkbox',
  'checkboxGroup',
] as const;

/** Sanity form field type union. */
export type SanityFormFieldType = (typeof SANITY_FORM_FIELD_TYPES)[number];

/** Field width within a section grid. */
export type SanityFormFieldWidth = 'full' | 'half';

/** CMS metadata hint for platform-access hydration destinations. */
export type SanityFormFieldStorageTarget =
  | 'answers_only'
  | 'prefill'
  | 'farm'
  | 'farm_location'
  | 'farm_certificate'
  | 'farm_info_internal_application'
  | 'advisor_notes'
  | 'retention_consent';

/** One checkbox option inside a `checkboxGroup` field. */
export interface SanityFormCheckboxOption {
  /** Stable answer key stored in Postgres */
  key: string;
  /** Display label beside the checkbox */
  label: string;
  /** Optional supporting copy below the option label */
  helpText?: string;
}

/** One field row from a Sanity `form` document. */
export interface SanityFormField {
  /** Stable answer key stored in Postgres */
  name: string;
  /** Display label */
  label: string;
  /** Input type */
  type: SanityFormFieldType;
  /** Column width within a section */
  width?: SanityFormFieldWidth;
  /** Whether the field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Help text below the label */
  helpText?: string;
  /** Options for `select` fields */
  options?: string[];
  /** Options for `checkboxGroup` fields — each key is stored flat in answers JSON */
  checkboxOptions?: SanityFormCheckboxOption[];
  /** Optional Postgres destination hint for platform-access forms */
  storageTarget?: SanityFormFieldStorageTarget;
}

/** One grouped section from a Sanity `form` document. */
export interface SanityFormSection {
  /** Section heading */
  title: string;
  /** Optional helper copy below the heading */
  description?: string;
  /** Fields rendered inside this section */
  fields: SanityFormField[];
}

/** One optional footer consent checkbox from a Sanity `form` document. */
export interface SanityFormFooterCheckbox {
  /** Stable answer key stored with the submission */
  name: string;
  /** Primary label beside the checkbox */
  label: string;
  /** Optional supporting copy below the label */
  helpText?: string;
  /** Whether the checkbox must be checked to submit */
  required?: boolean;
}

/** Sanity `form` document fetched for public rendering. */
export interface SanityForm {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  submitButtonLabel?: string;
  successTitle?: string;
  successMessage?: string;
  /** Grouped sections with layout metadata */
  sections?: SanityFormSection[];
  /** Legacy flat field list — used until migrated to sections in Sanity */
  fields?: SanityFormField[];
  /** Optional consent checkboxes shown after sections */
  footerCheckboxes?: SanityFormFooterCheckbox[];
  /** Optional disclosure copy shown before submit */
  footerText?: string;
  /** Post-submit workflow — generic storage vs platform access review/signup */
  workflowType?: SanityFormWorkflowType;
}
