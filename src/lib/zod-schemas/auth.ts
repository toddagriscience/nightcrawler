import { z } from 'zod';

/**
 * Minimum password length for security
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Password validation regex requiring:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/** Schema for log in validation */
const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/** Schema for single email validation */
const emailSchema = z.email('Invalid email address');

/**
 * Schema for password validation with strength requirements
 */
const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  .refine(
    (password) => PASSWORD_REGEX.test(password),
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
  );

/**
 * Schema for password update validation
 */
const updatePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

export { loginSchema, emailSchema, passwordSchema, updatePasswordSchema };
