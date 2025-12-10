// Copyright Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';

/**
 * Maximum length for contact form message field
 */
export const MAX_MESSAGE_LENGTH = 1500;

/**
 * Maximum length for name field
 */
export const MAX_NAME_LENGTH = 100;

/**
 * Valid reason options for contact form
 */
export const CONTACT_REASONS = [
  'general',
  'support',
  'business',
  'media',
  'other',
] as const;

/**
 * Schema for contact form validation with security constraints
 */
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(MAX_NAME_LENGTH, `Name must not exceed ${MAX_NAME_LENGTH} characters`)
    .trim()
    .refine(
      (name) => name.length > 0,
      'Full name cannot be only whitespace'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  reason: z.enum(CONTACT_REASONS, {
    errorMap: () => ({ message: 'Please select a valid reason' }),
  }),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`
    )
    .trim()
    .refine(
      (message) => message.length > 0,
      'Message cannot be only whitespace'
    ),
});

/**
 * Type for validated contact form data
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;
