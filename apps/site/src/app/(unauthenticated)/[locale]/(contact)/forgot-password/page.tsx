// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import MarketingGradientBox from '@/components/common/marketing-gradient-box/marketing-gradient-box';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ForgotPasswordFormData = { email: string };

/** The forgot password page. Sends an email via Supabase that links to `/accounts/reset-password` after verifying with an OTP code (again, all handled by Supabase).
 *
 * @returns {JSX.Element} - The ForgotPassword page*/
export default function ForgotPassword() {
  const [actionResult, setActionResult] = useState<{
    error: string[] | null;
    success: boolean;
  } | null>(null);
  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormData>(
    {
      defaultValues: { email: '' },
    }
  );
  const { isSubmitting } = formState;

  const errors = actionResult?.error ?? null;
  const isSuccess = actionResult?.success === true;

  async function onSubmit(data: ForgotPasswordFormData) {
    const formData = new FormData();
    formData.set('email', data.email);
    const result = await sendResetPasswordEmail(null, formData);
    if (result?.error) {
      setActionResult({
        error: formatActionResponseErrors(result),
        success: false,
      });
      return;
    }
    setActionResult({ error: [], success: true });
  }

  return (
    <main>
      <div className="max-w-[1400px] mx-auto px-15 lg:px-16 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 place-items-start mx-auto mt-25 md:mt-15 w-full max-w-[1200px] mx-auto">
          {/* Gradient image */}
          <MarketingGradientBox />
          <div className="flex w-full max-w-[530px] lg:max-w-none flex-col md:mr-0 lg:mr-10">
            <FadeIn>
              <div className="mx-auto flex flex-col justify-start w-full max-w-[280px] sm:max-w-[450px] md:max-w-[500px]">
                {isSuccess && (
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

                {!isSuccess && (
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
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                              type="email"
                              required
                              {...register('email')}
                            />
                          </Field>
                          <div className="mt-5 md:mt-10">
                            <SubmitButton
                              buttonText="Submit"
                              className="w-[144px] h-11 rounded-full px-8 py-3 font-semibold"
                              reactHookFormPending={isSubmitting}
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
