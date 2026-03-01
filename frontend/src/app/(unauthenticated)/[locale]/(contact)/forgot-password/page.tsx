// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { sendResetPasswordEmail } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/actions';
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
    <main>
      <div className="max-w-[1400px] mx-auto px-15 lg:px-16 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 place-items-start mx-auto mt-25 md:mt-15 w-full max-w-[1200px] mx-auto">
          {/* Gradient image */}
          <div
            className="flex md:w-auto md:min-w-[330px] lg:w-full md:h-[650px] lg:max-w-none justify-center items-start rounded-sm hidden md:block"
            style={{
              backgroundImage:
                'linear-gradient(90deg, hsl(35deg 39% 55%) 0%, hsl(34deg 38% 58%) 29%, hsl(34deg 37% 60%) 39%, hsl(34deg 36% 62%) 46%, hsl(34deg 36% 64%) 52%, hsl(34deg 35% 66%) 56%, hsl(34deg 34% 68%) 61%, hsl(34deg 34% 70%) 65%, hsl(34deg 34% 71%) 69%, hsl(35deg 33% 73%) 74%, hsl(35deg 33% 75%) 80%,hsl(35deg 32% 76%) 99%)',
            }}
          />
          <div className="flex w-full max-w-[530px] lg:max-w-none flex-col md:mr-0 lg:mr-10">
            <FadeIn>
              <div className="mx-auto flex flex-col justify-start w-full max-w-[280px] sm:max-w-[450px] md:max-w-[500px]">
                {Array.isArray(errors) && errors.length === 0 && (
                  <div className="flex h-full flex-col md:mt-10 gap-6 items-start lg:max-w-[420px]">
                    <h1 className="text-2xl mb-3 md:mb-5 md:mt-10 text-left">
                      Reset Password
                    </h1>
                    <p className="text-sm mb-8 text-left font-normal">
                      We&apos;ve sent an email with the information needed to
                      reset your password. If you haven&apos;t received the
                      email in a few minutes, check your junk mail and ensure
                      you entered the correct email.
                    </p>
                  </div>
                )}

                {(!errors || errors.length > 0) && (
                  <>
                    {errors && errors.length > 0 && (
                      <div className="mb-3">
                        {errors.map((error, index) => (
                          <p
                            key={index}
                            className="text-center text-sm text-red-500"
                          >
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                    <form action={resetPasswordAction}>
                      <FieldSet>
                        <FieldLegend>
                          <h1 className="text-2xl mb-3 md:mb-5 md:mt-10 text-left">
                            Reset Your Password
                          </h1>
                          <p className="text-sm mb-8 text-left font-normal">
                            Please provide your account email to receive a
                            password reset link.
                          </p>
                        </FieldLegend>
                        <FieldGroup className="flex flex-col gap-4">
                          <Field>
                            <FieldLabel
                              htmlFor="email"
                              className="leading-tight mb-[-6px]"
                            >
                              Email Address
                            </FieldLabel>
                            <Input
                              className="border-[#848484]/80 border-1"
                              id="email"
                              data-testid="email"
                              name="email"
                              type="email"
                              required
                            />
                          </Field>
                          <div className="mt-5 md:mt-10">
                            <SubmitButton
                              buttonText="Submit"
                              className="w-[144px]"
                              onClickFunction={() => {}}
                            />
                          </div>
                        </FieldGroup>
                      </FieldSet>
                    </form>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
