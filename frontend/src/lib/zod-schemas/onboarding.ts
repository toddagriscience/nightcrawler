// Copyright © Todd Agriscience, Inc. All rights reserved.

import z from 'zod';

export const userInfo = z.object({
  name: z.string().max(100).optional(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  farmName: z.string().min(1, 'Farm name is required').max(100),
  email: z.email('Invalid email address').max(100),
  // Very basic phone number handling
  phone: z.preprocess((phone: string) => {
    // 5554443333
    // 555-444-3333
    if ([10, 12].includes(phone.length) && phone.slice(1) != '+') {
      return '+1' + phone.replaceAll('-', '');
    }
    // +15554443333
    // +1-555-444-3333
    else if ([12, 15].includes(phone.length)) {
      return phone.replaceAll('-', '');
    }
    return phone;
  }, z.e164('Invalid phone number')),
  // Yes, this is stupid. See: https://github.com/colinhacks/zod/discussions/2801
  website: z.string().url().or(z.literal('')),
});
