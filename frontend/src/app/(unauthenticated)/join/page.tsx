// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { redirect, useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';
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

  return (
    <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
      <div className="w-[90vw] max-w-[inherit]">
        <FadeIn>
          {isSuccess ? (
            <>
              <h1 className="mb-6 text-center text-3xl">
                ACCOUNT CREATED SUCCESSFULLY
              </h1>
              <p className="mb-6 text-center">
                Please check your email to verify your account before logging
                in.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-6 text-center text-3xl">JOIN US</h1>

              {errors && errors.length > 0 && (
                <div className="mb-3">
                  {errors.map((error, index) => (
                    <p key={index} className="text-center text-sm text-red-500">
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

                <FieldSet className="mb-8">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        className="focus:ring-0!"
                        placeholder="Password"
                        id="password"
                        data-testid="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        className="focus:ring-0!"
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

                    <Field className="flex flex-row items-center justify-between">
                      <div className="flex basis-[min-content] flex-row items-center justify-center gap-2 text-nowrap">
                        <Checkbox
                          data-testid="show-password-checkbox"
                          id="show-password"
                          className="max-h-4 max-w-4 focus:ring-0!"
                          onCheckedChange={() => setShowPassword(!showPassword)}
                        />
                        <FieldLabel htmlFor="show-password">
                          Show Password
                        </FieldLabel>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <SubmitButton
                  buttonText={
                    isPasswordValid ? 'CREATE ACCOUNT' : 'INVALID PASSWORD'
                  }
                  disabled={!isPasswordValid}
                  className={
                    !isPasswordValid
                      ? 'border-1 border-solid border-black bg-transparent text-black/80 hover:bg-black/10'
                      : ''
                  }
                />
              </form>
            </>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
