// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { FadeIn } from '@/components/common';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { submitEmail } from '../careers/action';
import isWorkEmail from '@/lib/utils/is-work-email';
import { Button } from '@/components/ui';
import { ContactFormData, contactFormSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import Fade from 'embla-carousel-fade';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';

export default function Contact() {
  const t = useTranslations('contactPage');
  const [state, submitEmailAction] = useActionState(submitEmail, null);
  const [slide, setSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(-1);
  const [api, setApi] = useState<CarouselApi>();
  const {
    register,
    trigger,
    getValues,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: undefined,
      firstName: '',
      lastName: '',
      farmName: '',
      email: '',
      phone: '',
      isOrganic: false,
    },
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (!api) return;

    setTotalSlides(api.slideNodes().length);
    setSlide(api.selectedScrollSnap());

    api.on('select', () => setSlide(api.selectedScrollSnap()));
    api.on('slidesChanged', () => setTotalSlides(api.slideNodes().length));
  }, [api]);

  function handleBack() {
    api?.scrollPrev();
  }

  function handleNext() {
    if (!api) return;

    if (slide === 0) {
      const isValid =
        getValues().firstName &&
        getValues().lastName &&
        getValues().farmName &&
        getValues().email &&
        getValues().phone;

      if (isValid) {
        api.scrollNext();
        clearErrors();
      } else {
        trigger();
      }
      // Unfilled fields are automatically handled by useFormState
    } else {
      api.scrollNext();
    }
  }

  return (
    <form action={submitEmailAction}>
      <Carousel
        setApi={setApi}
        className="max-w-[800px] w-[80vw] mx-auto h-[90vh] flex flex-col justify-center"
        plugins={[Fade()]}
        opts={{ duration: 30, watchDrag: false }}
      >
        <CarouselContent>
          <CarouselItem>
            <FieldSet className="gap-4 flex flex-col">
              {/** Honeypot */}
              <Field className="hidden">
                <FieldLabel>{t('fields.name')}</FieldLabel>
                <Input
                  placeholder={t('placeholders.name')}
                  type="text"
                  {...register('name')}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel>{t('fields.firstName')}</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="firstName"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    placeholder={t('placeholders.firstName')}
                    required
                    {...register('firstName', {
                      required: 'This field is required.',
                    })}
                  />
                </Field>

                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel>{t('fields.lastName')}</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="lastName"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    placeholder={t('placeholders.lastName')}
                    required
                    {...register('lastName', {
                      required: 'This field is required.',
                    })}
                  />
                </Field>
              </div>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>{t('fields.farmName')}</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="farmName"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  placeholder={t('placeholders.farmName')}
                  required
                  {...register('farmName', {
                    required: 'This field is required.',
                  })}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>{t('fields.email')}</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  placeholder={t('placeholders.email')}
                  type="email"
                  required
                  {...register('email', {
                    required: 'This field is required.',
                  })}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>{t('fields.phone')}</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="phone"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  placeholder={t('placeholders.phone')}
                  type="tel"
                  required
                  {...register('phone', {
                    required: 'This field is required.',
                  })}
                />
              </Field>
            </FieldSet>
          </CarouselItem>

          {!isWorkEmail(getValues().email) && (
            <CarouselItem>
              <FieldSet>
                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel>
                      {t('questions.website', { farm: getValues().farmName })}
                    </FieldLabel>
                  </div>
                  <Input
                    placeholder={t('placeholders.website')}
                    {...register('website')}
                  />
                </Field>
              </FieldSet>
            </CarouselItem>
          )}

          <CarouselItem>
            <FieldSet>
              <h2>{t('questions.organic', { farm: getValues().farmName })}</h2>

              <div className="flex gap-8">
                <Button
                  type="button"
                  className="text-lg hover:cursor-pointer text-underline"
                  onClick={() => {
                    setValue('isOrganic', true);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.yes')}
                </Button>

                <Button
                  type="button"
                  className="text-lg hover:cursor-pointer text-underline"
                  onClick={() => {
                    setValue('isOrganic', false);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.no')}
                </Button>
              </div>
            </FieldSet>
          </CarouselItem>

          <CarouselItem>
            {isWorkEmail(getValues().email) || getValues().website ? (
              <div className="flex flex-col text-center justify-center h-full gap-8">
                <h1 className="text-xl md:text-5xl">
                  {t('results.matchTitle')}
                </h1>
                <p>{t('results.matchBody')}</p>
              </div>
            ) : (
              <div className="flex flex-col text-center justify-center h-full gap-8">
                <h1 className="text-xl md:text-5xl">
                  {t('results.noMatchTitle')}
                </h1>
                <p>{t('results.noMatchBody')}</p>
              </div>
            )}
          </CarouselItem>
        </CarouselContent>

        <div className="flex justify-between mt-4 min-h-10">
          {slide !== 0 && slide !== totalSlides - 1 ? (
            <FadeIn>
              <Button
                className="text-xl hover:cursor-pointer"
                type="button"
                onClick={handleBack}
                data-testid="button-back"
              >
                {t('buttons.back')}
              </Button>
            </FadeIn>
          ) : (
            <div />
          )}

          {slide < totalSlides - 2 ? (
            <FadeIn>
              <Button
                className="text-xl hover:cursor-pointer"
                type="button"
                onClick={handleNext}
                data-testid="button-next"
              >
                {t('buttons.next')}
              </Button>
            </FadeIn>
          ) : (
            <div />
          )}
        </div>
      </Carousel>
    </form>
  );
}
