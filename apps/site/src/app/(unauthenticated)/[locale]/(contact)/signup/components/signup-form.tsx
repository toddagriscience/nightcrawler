// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import { LegalSubtext } from '@/components/common/legal-subtext/legal-subtext';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import MarketingGradientBox from '@/components/common/marketing-gradient-box/marketing-gradient-box';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { normalizePhoneForUrl } from '@nightcrawler/db/utils/normalize-phone';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiShow, BiSolidHide } from 'react-icons/bi';
import { signUp } from '../actions';

/**
 * Returns true when an error is a Next.js redirect thrown from a server action.
 *
 * @param error - Caught client-side error
 */
function isRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

type SignUpFormData = {
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

/** Server-provided prefill for approved-applicant signup. */
export interface ApprovedApplicantSignupPrefill {
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
  phone: string;
  applicationId: string;
  token: string;
}

/** Props for the password step of signup. */
interface SignupFormProps {
  /** Whether this signup came from an approved platform-access application */
  isApprovedApplicantSignup: boolean;
  /** Server-loaded prefill for approved-applicant signup */
  prefill?: ApprovedApplicantSignupPrefill;
}

/**
 * Password form for cold contact signups and approved-applicant onboarding.
 *
 * @param props - Signup mode flags and optional server prefill
 */
export default function SignupForm({
  isApprovedApplicantSignup,
  prefill,
}: SignupFormProps) {
  const searchParams = useSearchParams();
  const [actionErrors, setActionErrors] = useState<string[]>([]);
  const resolvedPrefill = {
    firstName: prefill?.firstName ?? searchParams.get('first_name') ?? '',
    lastName: prefill?.lastName ?? searchParams.get('last_name') ?? '',
    farmName: prefill?.farmName ?? searchParams.get('farm_name') ?? '',
    email: prefill?.email ?? searchParams.get('email') ?? '',
    phone: normalizePhoneForUrl(
      prefill?.phone ?? searchParams.get('phone') ?? ''
    ),
    applicationId:
      prefill?.applicationId ?? searchParams.get('application_id') ?? '',
    token: prefill?.token ?? searchParams.get('token') ?? '',
  };
  const { register, handleSubmit, formState } = useForm<SignUpFormData>({
    defaultValues: {
      firstName: resolvedPrefill.firstName,
      lastName: resolvedPrefill.lastName,
      farmName: resolvedPrefill.farmName,
      email: resolvedPrefill.email,
      phone: resolvedPrefill.phone,
      password: '',
      confirmPassword: '',
    },
  });
  const { isSubmitting } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // These two states only exist for the sake of UX (see PasswordChecklist). It should not be utilized in form validation.
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const email = resolvedPrefill.email;
  const applicationId = resolvedPrefill.applicationId;
  const token = resolvedPrefill.token;

  const errors = actionErrors.length > 0 ? actionErrors : null;

  async function onSubmit(data: SignUpFormData) {
    setActionErrors([]);
    const formData = new FormData();
    formData.set('firstName', data.firstName);
    formData.set('lastName', data.lastName);
    formData.set('farmName', data.farmName);
    formData.set('email', data.email);
    formData.set('phone', data.phone);
    formData.set('password', data.password);
    if (applicationId) formData.set('applicationId', applicationId);
    if (token) formData.set('token', token);

    try {
      await signUp(null, formData);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      setActionErrors(formatActionResponseErrors(error));
      return;
    }

    return;
  }

  return (
    <main>
      <div className="max-w-[1400px] mx-auto px-15 lg:px-16 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mx-auto mt-25 md:mt-15 w-full max-w-[1200px] mx-auto">
          <MarketingGradientBox />
          <div className="flex w-full max-w-[530px] lg:max-w-none flex-col md:mr-0 lg:mr-10">
            <FadeIn>
              <div className="mx-auto flex flex-col justify-start w-full max-w-[280px] sm:max-w-[450px] md:max-w-[500px]">
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
                    <input type="hidden" {...register('firstName')} />
                    <input type="hidden" {...register('lastName')} />
                    <input type="hidden" {...register('farmName')} />
                    <input type="hidden" {...register('email')} />
                    <input type="hidden" {...register('phone')} />

                    <FieldSet className="">
                      <FieldLegend>
                        <h1 className="text-2xl mb-3 md:mb-5 md:mt-10 text-left">
                          Create your password
                        </h1>
                        <p className="text-sm mb-8 text-left font-normal">
                          Choose a password for {email}. You&apos;ll use it to
                          sign in and finish setting up your farm on Todd.
                        </p>
                      </FieldLegend>
                      <FieldGroup className="flex flex-col gap-4">
                        <Field>
                          <FieldLabel
                            htmlFor="password"
                            className="leading-tight mb-[-6px]"
                          >
                            Create a Password
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              className="border-[#848484]/80 border-1"
                              id="password"
                              data-testid="password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              {...register('password', {
                                onChange: (e) => setPassword(e.target.value),
                              })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground hover:cursor-pointer"
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                            >
                              {showPassword ? (
                                <BiSolidHide className="size-5" aria-hidden />
                              ) : (
                                <BiShow className="size-5" aria-hidden />
                              )}
                            </button>
                          </div>
                        </Field>

                        <Field className="mb-2">
                          <FieldLabel
                            htmlFor="confirmPassword"
                            className="leading-tight mb-[-6px]"
                          >
                            Confirm Password
                          </FieldLabel>

                          <Input
                            className="border-[#848484]/80 border-1 pr-10"
                            id="confirmPassword"
                            data-testid="confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            {...register('confirmPassword', {
                              onChange: (e) =>
                                setConfirmationPassword(e.target.value),
                            })}
                          />
                        </Field>

                        <PasswordChecklist
                          password={password}
                          confirmationPassword={confirmationPassword}
                          setIsPasswordValid={setIsPasswordValid}
                        />
                      </FieldGroup>
                    </FieldSet>
                    <div className="flex flex-col gap-10 mt-10">
                      <SubmitButton
                        buttonText="Continue"
                        disabled={!isPasswordValid || isSubmitting}
                        reactHookFormPending={isSubmitting}
                        className={
                          !isPasswordValid
                            ? 'border-1 border-solid bg-transparent text-black/90 w-[144px] border-[#848484]/80'
                            : 'w-[144px]'
                        }
                      />
                      <LegalSubtext />
                    </div>
                  </form>
                </>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
