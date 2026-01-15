// Copyright © Todd Agriscience, Inc. All rights reserved.

import z from 'zod';

export const publicInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(200, 'Name is too long.'),

  lastKnownEmail: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Please enter a valid email.')
    .max(320, 'Email is too long.'),

  response: z
    .string()
    .trim()
    .min(1, 'Response is required.')
    .max(1500, 'Response is too long (max 1500 characters).'),
});
