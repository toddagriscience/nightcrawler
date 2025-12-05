import { z } from 'zod';

/** Schema for log in validation */
const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/** Schema for single email validation */
const emailSchema = z.email('Invalid email address');

export { loginSchema, emailSchema };
