// Copyright © Todd Agriscience, Inc. All rights reserved.

import z from 'zod';

export const userInfo = z.object({
  name: z.string().max(100).optional(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  farmName: z.string().min(1, 'Farm name is required').max(100),
  email: z.email('Invalid email address').max(100),
  // Very basic phone number handling. Uses `.transform().pipe()` rather than
  // `z.preprocess()` because preprocess types its input as `unknown`, which
  // leaks into `z.input<>` and makes `zodResolver` incompatible with a form
  // typed on `z.infer<>`. Leading with `z.string()` also turns a non-string
  // into a validation error instead of a TypeError inside the callback.
  phone: z
    .string()
    .transform((phone) => {
      const withoutDashes = phone.replaceAll('-', '');
      const digits = withoutDashes.replace(/\D/g, '');

      if (withoutDashes.startsWith('+')) {
        return withoutDashes;
      }

      if (digits.length === 10) {
        return `+1${digits}`;
      }

      if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
      }

      return phone;
    })
    .pipe(z.e164('Invalid phone number')),
  // Yes, this is stupid. See: https://github.com/colinhacks/zod/discussions/2801
  website: z.string().url().or(z.literal('')).optional(),
  instagramHandle: z.string().max(100).optional(),
});
