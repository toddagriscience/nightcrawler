// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import { LegalSubtext } from '@/components/common/legal-subtext/legal-subtext';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { redirect, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useActionState, useState } from 'react';
import { BiShow, BiSolidHide } from 'react-icons/bi';
import { signUp } from './actions';

/** Both outbound (/incoming) and inbound (/en/contact) onboarding will redirect here. We only ask for the password since we already have the user's email.
 *
 * @returns {JSX.Element} - The signup page.*/
export default function Join() {
  const searchParams = useSearchParams();
  const [state, signUpAction] = useActionState(signUp, null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const firstName = searchParams.get('first_name') ?? '';
  const lastName = searchParams.get('last_name') ?? '';
  const farmName = searchParams.get('farm_name') ?? '';
  const email = searchParams.get('email') ?? '';
  const phone = searchParams.get('phone') ?? '';

  if (!firstName || !lastName || !farmName || !email || !phone) {
    redirect('/contact');
  }

  const errors = state ? formatActionResponseErrors(state) : null;
  const isSuccess = state && !state.error;

  // When the user creates their account, we can opt them in without asking
  if (isSuccess) {
    posthog.opt_in_capturing();
  }

  return (
    <main>
      <div className="max-w-[1400px] mx-auto px-15 lg:px-16 h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 place-items-start mx-auto md:mt-0 w-full max-w-[1200px] mx-auto">
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
                {isSuccess ? (
                  <div className="flex h-full flex-col md:mt-10 gap-6 items-start">
                    <h1 className="text-2xl mb-2 md:mt-8 text-left font-normal">
                      Your Todd Account Has Been Created!
                    </h1>
                    <p className="text-normal font-thin text-center md:text-left">
                      Please check your email for a verification link.
                    </p>
                  </div>
                ) : (
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

                    <form action={signUpAction}>
                      {/* Hidden fields for pre-filled values */}
                      <input type="hidden" name="firstName" value={firstName} />
                      <input type="hidden" name="lastName" value={lastName} />
                      <input type="hidden" name="farmName" value={farmName} />
                      <input type="hidden" name="email" value={email} />
                      <input type="hidden" name="phone" value={phone} />

                      <FieldSet className="">
                        <FieldLegend>
                          <h1 className="text-2xl mb-3 md:mb-5 md:mt-10 text-left">
                            You&apos;re Almost There!
                          </h1>
                          <p className="text-sm mb-8 text-left font-normal">
                            You&apos;ll use this to login and access your Todd
                            account in the future.
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
                                placeholder="Use at least 10 characters"
                                id="password"
                                data-testid="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground hover:cursor-pointer"
                                aria-label={
                                  showPassword
                                    ? 'Hide password'
                                    : 'Show password'
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
                              placeholder="Confirm Password"
                              id="confirmPassword"
                              data-testid="confirm-password"
                              name="confirmPassword"
                              type={showPassword ? 'text' : 'password'}
                              onChange={(e) =>
                                setConfirmationPassword(e.target.value)
                              }
                              required
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
                          disabled={!isPasswordValid}
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
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
