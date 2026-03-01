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
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent');
  const emailType = intent === 'forgot-email' ? '.forgotEmail' : '.email';

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
    <main>
      <div className="max-w-[1400px] mx-auto px-15 lg:px-16 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 place-items-start mx-auto mt-25 md:mt-15 w-full max-w-[1200px] mx-auto">
          {/* Gradient image */}
          <div
            className="flex md:w-auto md:min-w-[330px] lg:w-full md:h-[650px] lg:max-w-none justify-center items-start rounded-sm hidden md:block"
            style={{
              backgroundImage:
                'linear-gradient(90deg, hsl(35deg 39% 55%) 0%, hsl(34deg 38% 58%) 29%, hsl(34deg 37% 60%) 39%, hsl(34deg 36% 62%) 46%, hsl(34deg 36% 64%) 52%, hsl(34deg 35% 66%) 56%, hsl(34deg 34% 68%) 61%, hsl(34deg 34% 70%) 65%, hsl(34deg 34% 71%) 69%, hsl(35deg 33% 73%) 74%, hsl(35deg 33% 75%) 80%,hsl(35deg 32% 76%) 99%)',
            }}
          />
          <div className="flex w-full max-w-[530px] lg:max-w-none flex-col md:mr-0 lg:mr-10">
            <FadeIn>
              <div className="mx-auto flex flex-col justify-start w-full max-w-[280px] sm:max-w-[450px] md:max-w-[500px]">
                <div className="flex h-full flex-col md:mt-10 gap-6 items-start lg:max-w-[430px]">
                  <h1 className="text-2xl lg:text-3xl md:mb-5 text-left">
                    {isSubmitted ? t('success.title') : t('hero.title')}
                  </h1>
                  <p className="text-sm md:text-normal mb-8 text-left font-normal">
                    {isSubmitted ? t('success.subtitle') : t('hero.subtitle')}
                  </p>
                </div>
                {isSubmitted ? (
                  <>
                    <div className="flex justify-start mt-6">
                      <Button
                        onClick={() => router.push('/')}
                        className="w-[144px] rounded-full bg-black text-white hover:cursor-pointer hover:bg-black/80"
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
                              <FieldLabel
                                htmlFor="name"
                                className="leading-tight mb-[-6px]"
                              >
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
                              className="border-[#848484]/80 border-1"
                              id="name"
                              data-testid="name"
                              {...register('name')}
                              type="text"
                              required
                            />
                          </Field>
                          <Field>
                            <div className="flex flex-row justify-between">
                              <FieldLabel
                                htmlFor="lastKnownEmail"
                                className="leading-tight mb-[-6px]"
                              >
                                {t('fields' + emailType)}
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
                              className="border-[#848484]/80 border-1"
                              {...register('lastKnownEmail')}
                              required
                            />
                          </Field>
                          <Field>
                            <div className="flex flex-row justify-between">
                              <FieldLabel
                                htmlFor="response"
                                className="leading-tight mb-[-6px]"
                              >
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
                                className="border-[#848484]/80 border-1 ring-0! focus-visible:ring-0! focus-visible:ring-offset-0!"
                                {...register('response')}
                                rows={4}
                                required
                              />
                            </div>
                          </Field>
                        </FieldGroup>
                      </FieldSet>
                      <SubmitButton
                        buttonText={t('buttons.submit')}
                        className="w-[144px]"
                        disabled={isSubmitting || !isValid}
                        reactHookFormPending={isSubmitting}
                      />
                    </form>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
