// Copyright © Todd Agriscience, Inc. All rights reserved.
import z from 'zod';

const trimToString = (v: unknown) => {
  if (typeof v !== 'string') return '';
  return v.trim();
};

export const publicInquirySchema = z.object({
  name: z.preprocess(
    trimToString,
    z
      .string()
      .min(1, 'Name is required.')
      .max(200, 'Name is too long.')
  ),
  lastKnownEmail: z.preprocess(
    trimToString,
    z
      .string()
      .min(1, 'Email is required.')
      .email('Please enter a valid email.')
      .max(320, 'Email is too long.')
  ),
  response: z.preprocess(
    trimToString,
    z
      .string()
      .min(1, 'Response is required.')
      .max(1500, 'Response is too long (max 1500 characters).')
  ),
});