// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import PasswordChecklist from '@/components/common/password-checklist/password-checklist';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Button } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/format-action-response-errors';
import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';

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
    <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
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
              <h1 className="mb-6 text-center text-3xl">RESET PASSWORD</h1>

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
                      <Input
                        className="focus:ring-0!"
                        placeholder="New Password"
                        id="newPassword"
                        data-testid="new-password"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirmNewPassword">
                        Confirm New Password
                      </FieldLabel>
                      <Input
                        className="focus:ring-0!"
                        placeholder="Confirm New Password"
                        id="confirmNewPassword"
                        data-testid="confirm-new-password"
                        name="confirmNewPassword"
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
                  buttonText={isPasswordValid ? 'SAVE' : 'INVALID PASSWORD'}
                  disabled={!isPasswordValid}
                  className={
                    'mb-4 ' +
                    (!isPasswordValid &&
                      'bg-transparent text-black/80 border-black border-1 border-solid hover:bg-black/10')
                  }
                />

                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
                  type="button"
                >
                  CANCEL
                </Button>
              </form>
            </>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
