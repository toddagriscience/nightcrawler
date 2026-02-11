// Copyright © Todd Agriscience, Inc. All rights reserved.

import { userInsertSchema } from '@/lib/zod-schemas/db';
import { userInfo } from '@/lib/zod-schemas/onboarding';
import { z } from 'zod';

const { didOwnAndControlParcel, didManageAndControl } = userInsertSchema.shape;

/** Schema for accepting an invitation */
export const acceptInviteSchema = userInfo
  .pick({
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
  })
  .extend({
    job: userInsertSchema.shape.job,
    didOwnAndControlParcel,
    didManageAndControl,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type AcceptInvite = z.infer<typeof acceptInviteSchema>;
