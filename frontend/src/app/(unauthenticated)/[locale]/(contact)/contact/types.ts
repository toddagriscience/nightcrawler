// Copyright © Todd Agriscience, Inc. All rights reserved.

import { userInfo } from '@/lib/zod-schemas/onboarding';
import { z } from 'zod';

/** Notable fields:
 *
 * @property {string} name - This is a honeypot field.
 * @property {boolean} isOrganic - If the farm isn't purely organic, this should be false.
 * @property {boolean} isHydroponic - If the farm is hydroponic, this should be false (we want farms that are not hydroponic).
 * @property {boolean} producesSprouts - If the farm produces sprouts or other non-medium crops as a main product, this should be false (we want farms that do not produce sprouts). */
export const inboundOnboardingInfo = z.object({
  // Yes, this is stupid. See: https://github.com/colinhacks/zod/discussions/2801
  website: z.string().url().or(z.literal('')),
  isOrganic: z.boolean().optional(),
  isHydroponic: z.boolean(),
  producesSprouts: z.boolean(),
});

export const contactFormSchema = z.intersection(
  userInfo,
  inboundOnboardingInfo
);

export type ContactFormData = z.infer<typeof contactFormSchema>;
