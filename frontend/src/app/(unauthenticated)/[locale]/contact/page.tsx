// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
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
import isWorkEmail from '@/lib/utils/is-work-email';
import { Button } from '@/components/ui';
import { ContactFormData, contactFormSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import Fade from 'embla-carousel-fade';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const t = useTranslations('contactPage');
  const [slide, setSlide] = useState(0);
  const router = useRouter();
  const [totalSlides, setTotalSlides] = useState(-1);
  const [api, setApi] = useState<CarouselApi>();
  const {
    register,
    trigger,
    getValues,
    clearErrors,
    setValue,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: undefined,
      firstName: '',
      lastName: '',
      farmName: '',
      email: '',
      phone: '',
      website: undefined,
      isOrganic: undefined,
      isHydroponic: false,
      producesSprouts: false,
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

  async function handleNext() {
    if (!api) return;

    if (slide === 0 || slide === 1) {
      await trigger();

      if (isValid) {
        api.scrollNext();
        clearErrors();
      } else {
        trigger();
      }
    } else {
      api.scrollNext();
    }
  }

  // This function is triggered directly by the <SubmitButton/> because onSubmit via the form itself isn't working for some reason.
  async function onSubmit() {
    await trigger();

    if (isValid) {
      const params = new URLSearchParams({
        first_name: getValues().firstName,
        last_name: getValues().lastName,
        farm_name: getValues().farmName,
        email: getValues().email,
        phone: getValues().phone,
      });
      router.push(`/signup?${params.toString()}`);
    }
  }

  const isMatch =
    (isWorkEmail(getValues().email) || getValues().website) &&
    (getValues().isOrganic || getValues().isOrganic === undefined) &&
    !getValues().isHydroponic &&
    !getValues().producesSprouts;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && isValid) {
          e.preventDefault();
          api?.scrollNext();
        }
      }}
    >
      <Carousel
        setApi={setApi}
        className="mx-auto flex h-[90vh] w-[80vw] max-w-[800px] flex-col justify-center"
        plugins={[Fade()]}
        opts={{ duration: 30, watchDrag: false }}
      >
        <CarouselContent className="p-1">
          <CarouselItem>
            <FieldSet className="flex flex-col gap-4">
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
                  defaultValue={'+1'}
                  {...register('phone', {
                    required: 'This field is required.',
                  })}
                  maxLength={10}
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
                    <ErrorMessage
                      errors={errors}
                      name="website"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
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
                  className="text-underline text-lg hover:cursor-pointer"
                  onClick={() => {
                    setValue('isOrganic', true);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.yes')}
                </Button>

                <Button
                  type="button"
                  className="text-underline text-lg hover:cursor-pointer"
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
            <FieldSet>
              <h2>
                {t('questions.hydroponic', { farm: getValues().farmName })}
              </h2>

              <div className="flex gap-8">
                <Button
                  type="button"
                  className="text-underline text-lg hover:cursor-pointer"
                  onClick={() => {
                    setValue('isHydroponic', true);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.yes')}
                </Button>

                <Button
                  type="button"
                  className="text-underline text-lg hover:cursor-pointer"
                  onClick={() => {
                    setValue('isHydroponic', false);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.no')}
                </Button>
              </div>
            </FieldSet>
          </CarouselItem>

          <CarouselItem>
            <FieldSet>
              <h2>{t('questions.sprouts', { farm: getValues().farmName })}</h2>

              <div className="flex gap-8">
                <Button
                  type="button"
                  className="text-underline text-lg hover:cursor-pointer"
                  onClick={() => {
                    setValue('producesSprouts', true);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.yes')}
                </Button>

                <Button
                  type="button"
                  className="text-underline text-lg hover:cursor-pointer"
                  onClick={() => {
                    setValue('producesSprouts', false);
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.no')}
                </Button>
              </div>
            </FieldSet>
          </CarouselItem>

          <CarouselItem>
            {isMatch ? (
              <div className="flex h-full flex-col justify-center gap-8 text-center">
                <h1 className="text-xl md:text-5xl">
                  {t('results.matchTitle')}
                </h1>
                <p>{t('results.matchBody')}</p>
                <SubmitButton
                  className="max-w-60 mx-auto"
                  buttonText="JOIN US"
                  onClickFunction={onSubmit}
                />
              </div>
            ) : (
              <div className="flex h-full flex-col justify-center gap-8 text-center">
                <h1 className="text-xl md:text-5xl">
                  {t('results.noMatchTitle')}
                </h1>
                <p>{t('results.noMatchBody')}</p>
              </div>
            )}
          </CarouselItem>
        </CarouselContent>

        <div className="mt-4 flex min-h-10 justify-between">
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
