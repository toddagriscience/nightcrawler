// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import PublicInquiryModal from '@/components/common/public-inquiry-modal/public-inquiry-modal';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import NextLink from 'next/link';
import { login } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useActionState, useState } from 'react';
import { BiShow, BiSolidHide } from 'react-icons/bi';
/**
 * Login page. See `.src/lib/auth.ts` for more information regarding authentication and authorization.
 *
 * @returns {JSX.Element} - The login page
 * */
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, loginAction] = useActionState(login, null);

  const defaultCooldownTime = 3;
  const [cooldownError, setCooldownError] = useState('');
  const [cooldownTime, setCooldownTime] = useState<Date>();

  const errors =
    cooldownError != ''
      ? [cooldownError]
      : state
        ? formatActionResponseErrors(state)
        : null;

  return (
    <main>
      <div className="mx-auto flex min-h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
        <div className="w-[90vw] max-w-[inherit]">
          <FadeIn>
            <h1 className="mb-10 text-2xl">Login to Todd</h1>
            {errors && errors.length > 0 && (
              <div className="mb-6">
                {errors.map((error, index) => (
                  <p key={index} className="text-center text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            )}
            <form action={loginAction}>
              <FieldSet className="mb-10 flex flex-col gap-6">
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="mb-[-6px] leading-tight"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    className="border-1 border-[#848484]/80 focus:ring-0!"
                    placeholder="Email Address"
                    id="email"
                    data-testid="email"
                    name="email"
                    type="email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="mb-[-6px] leading-tight"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      data-testid="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="border-1 border-[#848484]/80 pr-10 focus:ring-0!"
                      name="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground hover:cursor-pointer"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <BiSolidHide className="size-5" aria-hidden />
                      ) : (
                        <BiShow className="size-5" aria-hidden />
                      )}
                    </button>
                  </div>
                </Field>
                <Field className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="keep-logged-in"
                    className="max-h-4 max-w-4 focus:ring-0!"
                    onCheckedChange={() => {}}
                  />
                  <FieldLabel
                    htmlFor="keep-logged-in"
                    className="text-sm font-normal"
                  >
                    Keep me logged in for up to 30 days
                  </FieldLabel>
                </Field>
              </FieldSet>

              <div className="mb-10 flex flex-row gap-4">
                <div className="flex-1">
                  <SubmitButton
                    buttonText="Login"
                    className="w-full rounded-full px-8 py-3 font-semibold"
                    cooldownTime={defaultCooldownTime}
                    sendCooldownTime={(date) => setCooldownTime(date)}
                    cooldownClickHandler={() => {
                      setCooldownError('Please wait between submissions');
                      setTimeout(
                        () => setCooldownError(''),
                        (cooldownTime
                          ? (new Date().getTime() - cooldownTime.getTime()) /
                            1000
                          : defaultCooldownTime) * 1000
                      );
                    }}
                  />
                </div>
                <div className="flex-1 [&_button]:w-full [&_button]:rounded-full [&_button]:px-8 [&_button]:py-3 [&_button]:font-semibold [&_button]:hover:border-[#848484]/80">
                  <PublicInquiryModal />
                </div>
              </div>

              <div className="mb-10 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#848484]" />
                <span className="text-sm">or</span>
                <div className="h-px flex-1 bg-[#848484]" />
              </div>

              <Button
                type="button"
                variant="brand"
                className="mb-10 w-fit rounded-full px-8 py-3 font-semibold text-background hover:cursor-pointer"
              >
                Login with passkeys
              </Button>

              <p className="text-left text-sm font-normal">
                Not yet a Todd Client?{' '}
                <NextLink href="/en/contact" className="font-bold underline">
                  Learn how to become one
                </NextLink>
              </p>
            </form>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
