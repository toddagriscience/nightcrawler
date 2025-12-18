// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useActionState } from 'react';
import { submitEmail } from './action';
import { FadeIn } from '@/components/common';
import { formatActionResponseErrors } from '@/lib/utils/format-action-response-errors';

/** The careers page. Currently only provides information on the externship and allows applicants to submit their email..
 *
 * @returns {JSX.Element} - The careers page. */
export default function Careers() {
  const [state, submitEmailAction] = useActionState(submitEmail, null);

  const errors = state ? formatActionResponseErrors(state) : null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <FadeIn className="max-w-[550px] w-[90%] gap-4 flex flex-col mx-auto">
        {Array.isArray(errors) && errors.length === 0 && (
          <>
            <h1 className="mb-6 text-center text-3xl">SUBMISSION SUCCESSFUL</h1>
            <p>
              Thanks for submitting your email. We&apos;ll contact you as soon
              as we have more information.
            </p>
          </>
        )}

        {(!errors || errors.length > 0) && (
          <>
            <h1 className="mb-6 text-center text-3xl">TODD EXTERNSHIP</h1>
            <p>
              Are you an aspiring software engineer, marketing/GTM specialist,
              or sales representative? Are you interested in a short-term
              learning experience? Our externship program might be for you!
              It&apos;s:
            </p>
            <ul className="list-disc ml-4">
              <li>~4 weeks long</li>
              <li>Aimed at early-career professionals</li>
              <li>A 10x learning opportunity</li>
            </ul>
            <p className="mb-4">
              Submit your email and get notified as soon as the application
              opens to score limited spots.
            </p>
            {errors && errors.length > 0 && (
              <div className="mb-3">
                {errors.map((error, index) => (
                  <p key={index} className="text-center text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            )}
            <form className="gap-4 flex flex-col" action={submitEmailAction}>
              <FieldSet>
                {/** THIS IS A HONEYPOT! */}
                <Field className="hidden">
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Name" id="name" name="name" type="text" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    placeholder="Email Address"
                    id="email"
                    data-testid="email"
                    name="email"
                    type="email"
                    required
                  />
                </Field>
              </FieldSet>
              <SubmitButton buttonText="SUBMIT" />
            </form>
          </>
        )}
      </FadeIn>
    </div>
  );
}
