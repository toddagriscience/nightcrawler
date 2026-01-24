// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Button } from '@/components/ui';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { submitPublicInquiry } from './action';
import { PublicInquiryData, publicInquirySchema } from './types';

/**
 * Support page. Allows users to submit a public inquiry support ticket.
 *
 * @returns {JSX.Element} - The support page with related logic.
 * */
export default function Support() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm<PublicInquiryData>({
    defaultValues: {
      name: '',
      lastKnownEmail: '',
      response: '',
    },
    resolver: zodResolver(publicInquirySchema),
    mode: 'onChange',
  });
  const t = useTranslations('supportPage');

  const onSubmit = async (data: PublicInquiryData) => {
    const formData = new FormData();
    formData.set('name', data.name);
    formData.set('lastKnownEmail', data.lastKnownEmail);
    formData.set('response', data.response);

    try {
      const result = await submitPublicInquiry(formData);
      if (result?.error) {
        const formatted = formatActionResponseErrors(result);
        setError('root', {
          message: formatted[0] ?? 'Something went wrong. Please try again.',
        });
        return;
      }

      reset();
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <main className="pt-2 sm:pt-24">
      <FadeIn>
        <section className="mx-auto sm:h-[70vh] h-[90vh] flex w-[90vw] max-w-[550px] flex-col items-center justify-center">
          <div className="w-[90vw] max-w-[inherit]">
            <div className="text-center mx-auto max-w-3xl px-2 mt-16">
              <h1 className="mb-8 text-4xl">
                {isSubmitted ? t('success.title') : t('hero.title')}
              </h1>
              <p className="mb-8 text-sm">
                {isSubmitted ? t('success.subtitle') : t('hero.subtitle')}
              </p>
            </div>
            {isSubmitted ? (
              <>
                <div className="flex justify-center mt-12 mb-12">
                  <Button
                    onClick={() => router.push('/')}
                    className="w-5/8 bg-black text-white hover:cursor-pointer hover:bg-black/80"
                    type="button"
                  >
                    {t('success.cta')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {errors.root?.message && (
                  <FormErrorMessage errorMessage={errors.root.message} />
                )}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 mb-24"
                >
                  <FieldSet className="mb-8">
                    <FieldGroup>
                      <Field>
                        <div className="flex flex-row justify-between">
                          <FieldLabel htmlFor="name">
                            {t('fields.name')}
                          </FieldLabel>
                          <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => (
                              <FormErrorMessage errorMessage={message} />
                            )}
                          />
                        </div>
                        <Input
                          className="focus:ring-0! bg-[var(--background-secondary)]/10"
                          placeholder={t('placeholders.name')}
                          id="name"
                          data-testid="name"
                          {...register('name')}
                          type="text"
                          required
                        />
                      </Field>
                      <Field>
                        <div className="flex flex-row justify-between">
                          <FieldLabel htmlFor="lastKnownEmail">
                            {t('fields.email')}
                          </FieldLabel>
                          <ErrorMessage
                            errors={errors}
                            name="lastKnownEmail"
                            render={({ message }) => (
                              <FormErrorMessage errorMessage={message} />
                            )}
                          />
                        </div>
                        <Input
                          id="lastKnownEmail"
                          data-testid="lastKnownEmail"
                          type="email"
                          placeholder={t('placeholders.email')}
                          className="focus:ring-0! bg-[var(--background-secondary)]/10"
                          {...register('lastKnownEmail')}
                          required
                        />
                      </Field>
                      <Field>
                        <div className="flex flex-row justify-between">
                          <FieldLabel htmlFor="response">
                            {t('fields.message')}
                          </FieldLabel>
                          <ErrorMessage
                            errors={errors}
                            name="response"
                            render={({ message }) => (
                              <FormErrorMessage errorMessage={message} />
                            )}
                          />
                        </div>
                        <div className="flex flex-row items-center justify-center gap-2 text-nowrap">
                          <Textarea
                            id="response"
                            placeholder={t('placeholders.message')}
                            {...register('response')}
                            rows={4}
                            className="focus:ring-0! w-full bg-[var(--background-secondary)]/10"
                            required
                          />
                        </div>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <SubmitButton
                    buttonText={t('buttons.submit')}
                    disabled={isSubmitting || !isValid}
                  />
                </form>
              </>
            )}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
