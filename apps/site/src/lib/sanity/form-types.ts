// Copyright © Todd Agriscience, Inc. All rights reserved.

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
] as const;

/** Sanity form field type union. */
export type SanityFormFieldType = (typeof SANITY_FORM_FIELD_TYPES)[number];

/** Field width within a section grid. */
export type SanityFormFieldWidth = 'full' | 'half';

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
}
