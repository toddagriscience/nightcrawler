// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { sendResetPasswordEmail } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/format-action-response-errors';
import { useActionState } from 'react';

/** The forgot password page. Sends an email via Supabase that links to `/accounts/reset-password` after verifying with an OTP code (again, all handled by Supabase).
 *
 * @returns {JSX.Element} - The ForgotPassword page*/
export default function ForgotPassword() {
  const [state, resetPasswordAction] = useActionState(
    sendResetPasswordEmail,
    null
  );

  const errors = state ? formatActionResponseErrors(state) : null;

  return (
    <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
      <div className="w-[90vw] max-w-[inherit]">
        <FadeIn>
          {Array.isArray(errors) && errors.length === 0 && (
            <>
              <h1 className="mb-6 text-center text-3xl">RESET PASSWORD</h1>
              <p className="text-center mb-6">
                We&apos;ve sent an email with the information needed to reset
                your password. If you haven&apos;t received the email in a few
                minutes, check your junk mail and ensure you entered the correct
                email.
              </p>
            </>
          )}

          {(!errors || errors.length > 0) && (
            <>
              <h1 className="mb-6 text-center text-3xl">RESET PASSWORD</h1>
              <p className="text-center mb-6">
                Please provide your account email to receive a password reset
                link.
              </p>
              {errors && errors.length > 0 && (
                <div className="mb-3">
                  {errors.map((error, index) => (
                    <p key={index} className="text-center text-sm text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              <form action={resetPasswordAction}>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <Input
                        className="focus:ring-0!"
                        placeholder="Email Address"
                        id="email"
                        data-testid="email"
                        name="email"
                        type="email"
                        required
                      />
                    </Field>
                    <SubmitButton
                      buttonText="SUBMIT"
                      onClickFunction={() => {}}
                    />
                  </FieldGroup>
                </FieldSet>
              </form>
            </>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
