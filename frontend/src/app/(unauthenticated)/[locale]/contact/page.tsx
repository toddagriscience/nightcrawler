// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Button } from '@/components/ui';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import isWorkEmail from '@/lib/utils/is-work-email';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Fade from 'embla-carousel-fade';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContactFormData, contactFormSchema } from './types';

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
    <main>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 place-items-center mx-auto mt-20 w-full max-w-[1200px] mx-auto">
          <div className="flex w-full max-w-[530px] lg:w-[550px] lg:max-w-none justify-center items-start gap-4">
            <Image
              src="/farmer.webp"
              alt="Farmer"
              width={530}
              height={900}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex w-full max-w-[530px] lg:w-[530px] lg:max-w-none flex-col">
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
                className="mx-auto flex flex-col justify-start p-0 w-full max-w-[300px] sm:max-w-[450px] lg:max-w-[500px]"
                plugins={[Fade()]}
                opts={{ duration: 30, watchDrag: false }}
              >
                <CarouselContent className="p-0">
                  {/* Get Started with Todd*/}
                  <CarouselItem>
                    <FieldSet className="flex flex-col gap-6">
                      <h1 className="text-2xl md:text-2xl mb-10 lg:mb-4 mt-10 lg:mt-5 text-center lg:text-left">
                        {t('description')}
                      </h1>
                      {/** Honeypot */}
                      <Field className="hidden">
                        <FieldLabel className="text-base">
                          {t('fields.name')}
                        </FieldLabel>
                        <Input
                          className="border-[#848484] border-1"
                          placeholder={t('placeholders.name')}
                          type="text"
                          {...register('name')}
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field>
                          <div className="flex flex-row justify-between">
                            <FieldLabel className="text-normal">
                              {t('fields.firstName')}
                            </FieldLabel>
                            <ErrorMessage
                              errors={errors}
                              name="firstName"
                              render={({ message }) => (
                                <FormErrorMessage errorMessage={message} />
                              )}
                            />
                          </div>
                          <Input
                            className="border-[#848484] border-1"
                            required
                            {...register('firstName', {
                              required: 'This field is required.',
                            })}
                          />
                        </Field>

                        <Field>
                          <div className="flex flex-row justify-between">
                            <FieldLabel className="text-normal">
                              {t('fields.lastName')}
                            </FieldLabel>
                            <ErrorMessage
                              errors={errors}
                              name="lastName"
                              render={({ message }) => (
                                <FormErrorMessage errorMessage={message} />
                              )}
                            />
                          </div>
                          <Input
                            className="border-[#848484] border-1"
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
                          className="border-[#848484] border-1"
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
                          className="border-[#848484] border-1"
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
                          className="border-[#848484] border-1"
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
                    <div className="flex flex-col justify-center gap-1 mt-12 mb-12">
                      <p className="text-xs mb-10">
                        Already started?{' '}
                        <Link href="/login" className="underline">
                          Login to complete your application
                        </Link>
                      </p>
                      <p className="text-xs">
                        By continuing, you agree to the{' '}
                        <Link href="/account-agreement" className="underline">
                          Todd Account Agreement
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                      <p className="text-xs">
                        <Link href="/terms-of-service" className="underline">
                          Terms of Service
                        </Link>{' '}
                        apply.
                      </p>
                    </div>
                  </CarouselItem>
                  {/* Website Question */}
                  {!isWorkEmail(getValues().email) && (
                    <CarouselItem>
                      <FieldSet>
                        <Field>
                          <div className="flex flex-row justify-between lg:mt-23">
                            <FieldLabel>
                              {t('questions.website', {
                                farm: getValues().farmName,
                              })}
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
                            className="border-[#848484] border-1"
                            {...register('website')}
                          />
                        </Field>
                      </FieldSet>
                    </CarouselItem>
                  )}

                  {/* Organic Question */}
                  <CarouselItem>
                    <FieldSet>
                      <h2 className="lg:mt-23">
                        {t('questions.organic', { farm: getValues().farmName })}
                      </h2>

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

                  {/* Hydroponic Question */}
                  <CarouselItem>
                    <FieldSet>
                      <h2 className="lg:mt-23">
                        {t('questions.hydroponic', {
                          farm: getValues().farmName,
                        })}
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

                  {/* Sprouts Question */}
                  <CarouselItem>
                    <FieldSet>
                      <h2 className="lg:mt-23">
                        {t('questions.sprouts', { farm: getValues().farmName })}
                      </h2>

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
                      <div className="flex h-1/2 lg:h-full flex-col justify-center gap-8 text-center">
                        <h1 className="text-4xl md:text-5xl">
                          {t('results.matchTitle')}
                        </h1>
                        <p className="text-md md:text-lg">
                          {t('results.matchBody')}
                        </p>
                        <SubmitButton
                          className="max-w-50 mx-auto rounded-full py-6"
                          buttonText="JOIN US"
                          onClickFunction={onSubmit}
                        />
                      </div>
                    ) : (
                      <div className="flex h-1/2 lg:h-full flex-col justify-center gap-8 text-center">
                        <h1 className="text-2xl md:text-3xl max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] mx-auto">
                          {t('results.noMatchTitle')}
                        </h1>
                        <p className="text-sm md:text-base max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] mx-auto">
                          {t('results.noMatchBody')}
                        </p>
                      </div>
                    )}
                  </CarouselItem>
                </CarouselContent>

                <div className="mt-1 flex min-h-10 justify-between">
                  {slide !== 0 && slide !== totalSlides - 1 ? (
                    <FadeIn>
                      <Button
                        variant="outline"
                        className="text-normal md:text-base hover:cursor-pointer rounded-full h-auto px-8 py-2 max-w-40"
                        type="button"
                        onClick={handleBack}
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
                        variant="outline"
                        className="text-normal md:text-base hover:cursor-pointer rounded-full h-auto px-8 py-2 max-w-40"
                        type="button"
                        onClick={handleNext}
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
          </div>
        </div>
      </div>
    </main>
  );
}
