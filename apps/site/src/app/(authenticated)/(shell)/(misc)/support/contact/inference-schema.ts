// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';

/** Bounded search context accepted by the authenticated advisor handoff. */
export const inferenceContactSchema = z
  .object({
    questions: z.array(z.string().trim().min(1).max(1000)).min(1).max(10),
    managementZoneId: z.number().int().positive().optional(),
  })
  .strict()
  .refine(
    (input) =>
      input.questions.reduce(
        (length, question) => length + question.length,
        0
      ) <= 4000,
    {
      message:
        'Your questions are too long to transfer. Please start a new search or contact your advisor directly.',
    }
  );

/** Opaque identifier; question text is never placed in the contact URL. */
export const inferenceContextTokenSchema = z.string().uuid();

/** Draft lifetime before it can no longer be loaded or sent. */
export const INFERENCE_CONTACT_LIFETIME_MS = 30 * 60 * 1000;
