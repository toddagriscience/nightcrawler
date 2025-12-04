// Copyright Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/lib/actions/auth';
import { loginErrors } from '@/lib/auth';
import { useActionState } from 'react';

/** Reset password page, protected by middleware.
 *
 * @returns {JSX.Element} - The password reset page*/
export default function ResetPassword() {
  const [state, resetPasswordAction] = useActionState(updateUser, null);

  const errors = state ? loginErrors(state) : null;

  return (
    <div>
      <FadeIn>
        {errors === null && (
          <form action={resetPasswordAction}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    className="focus:ring-0!"
                    placeholder="New Password"
                    id="newPassword"
                    data-testid="new-password"
                    name="newPassword"
                    type="password"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmNewPassword">
                    Old Password
                  </FieldLabel>
                  <Input
                    className="focus:ring-0!"
                    placeholder="Confirm New Password"
                    id="confirmNewPassword"
                    data-testid="confirm-new-password"
                    name="confirmNewPassword"
                    type="password"
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <SubmitButton buttonText="Update Password" />
          </form>
        )}

        {Array.isArray(errors) && errors.length === 0 && (
          <p className="text-center text-sm text-green-600 mt-3">
            Password updated succesfully!
          </p>
        )}

        {Array.isArray(errors) && errors.length > 0 && (
          <div className="mb-3">
            {errors.map((error, index) => (
              <p key={index} className="text-center text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
