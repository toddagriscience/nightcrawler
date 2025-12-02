'use client';

import { FadeIn } from '@/components/common';
import { Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/lib/actions/auth';
import LoginResponse from '@/lib/types/auth';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
      type="submit"
      disabled={pending}
    >
      {pending ? <Spinner className="mx-auto w-5 h-5" /> : 'LOGIN'}
    </Button>
  );
}

/**
 * Standardizes all the different error types produced by the login action into a list
 *
 * @param state The current form action state
 * @returns A list of all the errors
 */
function loginErrors(state: LoginResponse | null): string[] {
  if (!state?.error) return [];
  if (typeof state.error === 'string') return [state.error];
  if (state.error instanceof Error) return [state.error.message];
  if ('errors' in state.error) return state.error.errors;
  return [];
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, loginAction] = useActionState(login, null);
  const errors = loginErrors(state);

  return (
    <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
      <div className="w-[90vw] max-w-[inherit]">
        <FadeIn>
          <h1 className="mb-6 text-center text-3xl">LOGIN</h1>
          {errors.length > 0 && (
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
                    href={'/todo'}
                    className="basis-[min-content] text-sm text-nowrap underline"
                  >
                    Forgot Password
                  </Link>
                </Field>
              </FieldGroup>
            </FieldSet>
            <SubmitButton />
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
