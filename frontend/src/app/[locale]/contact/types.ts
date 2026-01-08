// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().max(100).optional(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  farmName: z.string().min(1, 'Farm name is required').max(100),
  email: z.email('Invalid email address').max(100),
  phone: z.string().min(1, 'Phone number is required').max(100),
  website: z.url('Invalid website URL').max(100).optional(),
  isOrganic: z.boolean(),
});

/** Notable fields:
 *
 * @property {string} name - This is a honeypot field.
 * @property {boolean} isOrganic - If the farm isn't purely organic, this should be false. */
export type ContactFormData = z.infer<typeof contactFormSchema>;
