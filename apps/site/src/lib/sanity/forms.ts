// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client } from '@/lib/sanity/client';
import { logger } from '@/lib/logger';
import type { SanityForm } from '@/lib/sanity/form-types';
import { FilteredResponseQueryOptions } from 'next-sanity';

/** GROQ projection for public form documents. */
const GROQ_FORM_FIELD = `
  name,
  label,
  type,
  width,
  required,
  placeholder,
  helpText,
  options
`;

/** GROQ projection for public form documents. */
const GROQ_FORM_BODY = `
  _id,
  title,
  slug,
  description,
  submitButtonLabel,
  successTitle,
  successMessage,
  sections[] {
    title,
    description,
    fields[] {${GROQ_FORM_FIELD}}
  },
  fields[] {${GROQ_FORM_FIELD}},
  footerCheckboxes[] {
    name,
    label,
    helpText,
    required
  },
  footerText,
  workflowType
`;

/** One hour ISR for CMS form definitions. */
const FORM_REVALIDATE = 60 * 60;

/**
 * Fetches a published Sanity form definition by slug.
 *
 * @param slug - Form slug `current` value
 * @param options - Optional Sanity fetch options
 * @returns Form document or null when missing
 */
export async function getFormBySlug(
  slug: string,
  options?: FilteredResponseQueryOptions
): Promise<SanityForm | null> {
  try {
    const query = `*[_type == "form" && slug.current == $slug][0] {${GROQ_FORM_BODY}}`;
    const form = await client.fetch<SanityForm | null>(
      query,
      { slug },
      options ?? { next: { revalidate: FORM_REVALIDATE } }
    );
    return form ?? null;
  } catch (error) {
    logger.error('Sanity getFormBySlug failed', error);
    return null;
  }
}
