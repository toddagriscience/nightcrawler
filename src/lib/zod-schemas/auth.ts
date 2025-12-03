import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const emailSchema = z.email('Invalid email address');

export { loginSchema, emailSchema };
