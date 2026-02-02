// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';
import { userInfo } from './onboarding';

/** Schema for accepting an invitation */
export const acceptInviteSchema = userInfo
  .pick({
    firstName: true,
    lastName: true,
    phone: true,
  })
  .extend({
    job: z.string().max(200).optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
