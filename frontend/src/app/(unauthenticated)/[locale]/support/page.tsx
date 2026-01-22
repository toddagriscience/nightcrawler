// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * Support page. Allows users to submit a public inquiry support ticket.
 *
 * @returns {JSX.Element} - The support page with related logic.
 * */
export default function Support() {


  return (
    <main> 
        <FadeIn>
        <div className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
        <div className="w-[90vw] max-w-[inherit]">
        <section className="text-center mx-auto max-w-3xl px-2 pt-8">
            <h1 className="mt-16 mb-8 text-4xl font-light">Need Help?</h1>
                <p className="mb-8 text-sm text-gray-500">
                    We're here to help you get the most out of our platform.
                </p>
        </section>
          <form className="flex flex-col gap-4">
            <FieldSet className="mb-8">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    className="focus:ring-0!"
                    placeholder="Name"
                    id="name"
                    data-testid="name"
                    name="name"
                    type="text"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    data-testid="email"
                    type="email"
                    placeholder="Email Address"
                    className="focus:ring-0!"
                    name="email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <div className="flex flex-row items-center justify-center gap-2 text-nowrap">
                    <Textarea
                      id="message"
                      placeholder="Message"
                      name="message"
                      rows={4}
                      className="focus:ring-0! w-full"
                    />
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
            <SubmitButton
              buttonText="SUBMIT"
            />
          </form>
        </div>
      </div>
    </FadeIn>
    </main>
  );
}