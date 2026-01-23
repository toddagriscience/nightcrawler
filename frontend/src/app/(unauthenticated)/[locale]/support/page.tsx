// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn } from '@/components/common';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';

/**
 * Support page. Allows users to submit a public inquiry support ticket.
 *
 * @returns {JSX.Element} - The support page with related logic.
 * */
export default function Support() {
  const t = useTranslations('supportPage');


  return (
    <main> 
      <FadeIn>
        <section className="mx-auto flex h-screen w-[90vw] max-w-[550px] flex-col items-center justify-center">
          <div className="w-[90vw] max-w-[inherit]">
            <div className="text-center mx-auto max-w-3xl px-2 pt-8">
              <h1 className="mt-16 mb-8 text-4xl font-light">{t('hero.title')}</h1>
                <p className="mb-8 text-sm text-gray-500">
                    {t('hero.subtitle')}
                </p>
            </div>
          <form className="flex flex-col gap-4">
            <FieldSet className="mb-8">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">{t('fields.name')}</FieldLabel>
                  <Input
                    className="focus:ring-0!"
                    placeholder={t('placeholders.name')}
                    id="name"
                    data-testid="name"
                    name="name"
                    type="text"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">{t('fields.email')}</FieldLabel>
                  <Input
                    id="email"
                    data-testid="email"
                    type="email"
                    placeholder={t('placeholders.email')}
                    className="focus:ring-0!"
                    name="email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message">{t('fields.message')}</FieldLabel>
                  <div className="flex flex-row items-center justify-center gap-2 text-nowrap">
                    <Textarea
                      id="message"
                      placeholder={t('placeholders.message')}
                      name="message"
                      rows={4}
                      className="focus:ring-0! w-full"
                    />
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
            <SubmitButton
              buttonText={t('buttons.submit')}
            />
          </form>
        </div>
    
      </section>
    </FadeIn>
    </main>
  );
}