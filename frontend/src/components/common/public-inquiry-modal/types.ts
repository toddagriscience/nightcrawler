// Copyright © Todd Agriscience, Inc. All rights reserved.

import z from 'zod';

const emptyToUndefined = (v: unknown) => {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
};

export const publicInquirySchema = z.object({
  name: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(200, 'Name is too long.').optional()
  ),
  lastKnownEmail: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .email('Please enter a valid email.')
      .max(320, 'Email is too long.')
      .optional()
  ),
  response: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(1500, 'Response is too long (max 1500 characters).')
      .optional()
  ),
});
