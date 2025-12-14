// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions/auth';
import { loginErrors } from '@/lib/auth';
import Link from 'next/link';
import { useActionState, useState } from 'react';

/**
 * Login page. See `.src/lib/auth.ts` for more information regarding authentication and authorization.
 *
 * @returns {JSX.Element} - The login page
 * */
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, loginAction] = useActionState(login, null);
  const errors = loginErrors(state);

  return (
    <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
      <div className="w-[90vw] max-w-[inherit]">
        <FadeIn>
          <h1 className="mb-6 text-center text-3xl">LOGIN</h1>
          {errors && errors.length > 0 && (
            <div className="mb-3">
              {errors.map((error, index) => (
                <p key={index} className="text-center text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          )}
          <form action={loginAction}>
            <FieldSet className="mb-8">
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
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    data-testid="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="focus:ring-0!"
                    name="password"
                    required
                  />
                </Field>
                <Field className="flex flex-row items-center justify-between">
                  <div className="flex basis-[min-content] flex-row items-center justify-center gap-2 text-nowrap">
                    <Checkbox
                      id="show-password"
                      className="max-h-4 max-w-4 focus:ring-0!"
                      onCheckedChange={() => setShowPassword(!showPassword)}
                    />
                    <FieldLabel htmlFor="show-password">
                      Show Password
                    </FieldLabel>
                  </div>
                  <Link
                    href={'/forgot-password'}
                    className="basis-[min-content] text-sm text-nowrap underline"
                  >
                    Forgot Password
                  </Link>
                </Field>
              </FieldGroup>
            </FieldSet>
            <SubmitButton buttonText="LOGIN" />
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
