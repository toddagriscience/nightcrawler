// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/lib/actions/auth';
import { useFormState } from 'react-dom';

export default function ForgotPassword() {
  const [state, resetPasswordAction] = useFormState(resetPassword, null);

  return (
    <div>
      <FadeIn>
        <form action={resetPasswordAction}>
          <FieldSet>
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
              <SubmitButton buttonText="Reset Password" />
            </FieldGroup>
          </FieldSet>
        </form>
      </FadeIn>
    </div>
  );
}
