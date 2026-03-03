// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Button } from '@/components/ui';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { BiShow, BiSolidHide } from 'react-icons/bi';

/** Reset password page, protected by middleware.
 *
 * @returns {JSX.Element} - The password reset page*/
export default function ResetPassword() {
  const [state, resetPasswordAction] = useActionState(updateUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const router = useRouter();

  // These two states only exists for the sake of UX (see PasswordChecklist). It should not be utilized in form validation.
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const errors = state ? formatActionResponseErrors(state) : null;

  return (
    <div className="mx-auto flex h-screen w-[90vw] max-w-[450px] flex-col items-center justify-center">
      <div className="w-[90vw] max-w-[inherit]">
        <FadeIn>
          {Array.isArray(errors) && errors.length === 0 && (
            <>
              <h1 className="mb-6 text-center text-3xl">
                PASSWORD RESET SUCCESSFUL
              </h1>
              <p className="text-center mb-6">
                Your password has been updated successfully.
              </p>
              <SubmitButton
                buttonText="DASHBOARD"
                onClickFunction={() => router.push('/')}
              ></SubmitButton>
            </>
          )}

          {(!errors || errors.length > 0) && (
            <>
              <h1 className="mb-10 text-center text-3xl">Reset Password</h1>

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
                <FieldSet className="mb-8">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="newPassword">
                        New Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          className="focus:ring-0! bg-transparent mt-[-6px]"
                          id="newPassword"
                          data-testid="new-password"
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-[15px] -translate-y-1/2 text-foreground/70 hover:text-foreground hover:cursor-pointer"
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

                    <Field>
                      <FieldLabel htmlFor="confirmNewPassword">
                        Confirm New Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          className="focus:ring-0! bg-transparent mt-[-6px]"
                          id="confirmNewPassword"
                          data-testid="confirm-new-password"
                          name="confirmNewPassword"
                          type={showPassword ? 'text' : 'password'}
                          onChange={(e) =>
                            setConfirmationPassword(e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-[15px] -translate-y-1/2 text-foreground/70 hover:text-foreground hover:cursor-pointer"
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

                    <PasswordChecklist
                      password={password}
                      confirmationPassword={confirmationPassword}
                      setIsPasswordValid={setIsPasswordValid}
                    />
                  </FieldGroup>
                </FieldSet>
                <div className="flex flex-col gap-4">
                  <SubmitButton
                    buttonText={isPasswordValid ? 'Save' : 'Invalid password'}
                    disabled={!isPasswordValid}
                    className={
                      !isPasswordValid
                        ? 'bg-transparent text-black/80 border-black border-1 border-solid w-[144px] h-11'
                        : 'w-[144px] h-11'
                    }
                  />

                  <Button
                    onClick={() => router.push('/')}
                    className="w-[144px] h-11 text-foreground hover:cursor-pointer hover:bg-black/80 hover:text-white rounded-full bg-transparent"
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
