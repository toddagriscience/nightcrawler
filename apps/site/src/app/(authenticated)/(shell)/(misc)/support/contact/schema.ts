// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';

/** Client-editable fields for an authenticated advisor contact request. */
export const contactSchema = z
  .object({
    subject: z
      .string()
      .trim()
      .min(1, 'Enter a subject.')
      .max(160, 'Use 160 characters or fewer.'),
    message: z
      .string()
      .trim()
      .min(1, 'Enter a message.')
      .max(5000, 'Use 5,000 characters or fewer.'),
  })
  .strict();
