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
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
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
      <div className="max-w-[1400px] mx-auto px-15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 place-items-center mx-auto mt-10 mb-20 md:mt-20 md:mb-26 w-full max-w-[1200px] mx-auto">
          <div className="flex md:w-auto lg:w-full max-w-[660px] lg:h-full lg:w-full lg:max-w-none justify-center items-start gap-4">
            <Image
              src="/marketing/contact-img.svg"
              alt="Farmer"
              width={530}
              height={900}
              className="w-full h-[760px] object-cover rounded-sm hidden md:block md:rotate-180"
            />
          </div>
          <div className="flex w-full max-w-[530px] lg:max-w-none flex-col">
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
                className="mx-auto flex flex-col justify-start gap-5 w-full max-w-[300px] sm:max-w-[450px] md:max-w-[500px]"
                plugins={[Fade()]}
                opts={{ duration: 30, watchDrag: false }}
              >
                <CarouselContent className="p-0 h-auto">
                  {/* Get Started with Todd*/}
                  <CarouselItem>
                    <FieldSet className="flex flex-col gap-6">
                      <h1 className="text-2xl mb-10 md:mb-2 mt-10 md:mt-5 text-center md:text-left">
                        {t('description')}
                      </h1>
                      {/** Honeypot */}
                      <Field className="hidden">
                        <FieldLabel className="text-base">
                          {t('fields.name')}
                        </FieldLabel>
                        <Input
                          className="border-[#848484]/80 border-1 "
                          placeholder={t('placeholders.name')}
                          type="text"
                          {...register('name')}
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field>
                          <div className="flex flex-row justify-between">
                            <FieldLabel className="text-normal leading-tight">
                              {t('fields.firstName')}
                            </FieldLabel>
                            <ErrorMessage
                              errors={errors}
                              name="firstName"
                              render={({ message }) => (
                                <FormErrorMessage
                                  errorMessage={message}
                                  className="text-[#dc2626] text-xs"
                                />
                              )}
                            />
                          </div>
                          <Input
                            className="border-[#848484]/80 border-1"
                            required
                            {...register('firstName', {
                              required: 'This field is required.',
                            })}
                          />
                        </Field>

                        <Field>
                          <div className="flex flex-row justify-between">
                            <FieldLabel className="text-normal leading-tight">
                              {t('fields.lastName')}
                            </FieldLabel>
                            <ErrorMessage
                              errors={errors}
                              name="lastName"
                              render={({ message }) => (
                                <FormErrorMessage
                                  errorMessage={message}
                                  className="text-[#dc2626] text-xs"
                                />
                              )}
                            />
                          </div>
                          <Input
                            className="border-[#848484]/80 border-1"
                            required
                            {...register('lastName', {
                              required: 'This field is required.',
                            })}
                          />
                        </Field>
                      </div>

                      <Field>
                        <div className="flex flex-row justify-between">
                          <FieldLabel className="leading-tight">
                            {t('fields.farmName')}
                          </FieldLabel>
                          <ErrorMessage
                            errors={errors}
                            name="farmName"
                            render={({ message }) => (
                              <FormErrorMessage
                                errorMessage={message}
                                className="text-[#dc2626] text-xs"
                              />
                            )}
                          />
                        </div>
                        <Input
                          className="border-[#848484]/80 border-1"
                          required
                          {...register('farmName', {
                            required: 'This field is required.',
                          })}
                        />
                      </Field>

                      <Field>
                        <div className="flex flex-row justify-between">
                          <FieldLabel className="leading-tight">
                            {t('fields.email')}
                          </FieldLabel>
                          <ErrorMessage
                            errors={errors}
                            name="email"
                            render={({ message }) => (
                              <FormErrorMessage
                                errorMessage={message}
                                className="text-[#dc2626] text-xs"
                              />
                            )}
                          />
                        </div>
                        <Input
                          className="border-[#848484]/80 border-1"
                          type="email"
                          required
                          {...register('email', {
                            required: 'This field is required.',
                          })}
                        />
                        <FieldDescription>
                          <span className="text-xs text-[#dc2626]">
                            /!\ {t('fields.emailDescription')}
                          </span>
                        </FieldDescription>
                      </Field>

                      <Field>
                        <div className="flex flex-row justify-between">
                          <FieldLabel className="leading-tight">
                            {t('fields.phone')}
                          </FieldLabel>
                          <ErrorMessage
                            errors={errors}
                            name="phone"
                            render={({ message }) => (
                              <FormErrorMessage
                                errorMessage={message}
                                className="text-[#dc2626] text-xs"
                              />
                            )}
                          />
                        </div>
                        <Input
                          className="border-[#848484]/80 border-1"
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
                    <div className="mt-10">
                      <p className="text-xs mb-5 font-thin">
                        Already started?{' '}
                        <Link href="/login" className="underline font-normal">
                          Login to complete your application
                        </Link>
                      </p>
                    </div>
                  </CarouselItem>
                  {/* Website Question */}
                  {!isWorkEmail(getValues().email) && (
                    <CarouselItem>
                      <FieldSet>
                        <Field>
                          <div className="flex flex-row justify-start mt-23">
                            <FieldLabel className="text-base leading-tight">
                              {t('questions.website', {
                                farm: getValues().farmName,
                              })}
                            </FieldLabel>
                            <ErrorMessage
                              errors={errors}
                              name="website"
                              render={({ message }) => (
                                <FormErrorMessage
                                  errorMessage={message}
                                  className="text-[#dc2626] text-xs"
                                />
                              )}
                            />
                          </div>
                          <Input
                            className="border-[#848484]/80 border-1"
                            {...register('website')}
                          />
                        </Field>
                      </FieldSet>
                    </CarouselItem>
                  )}

                  {/* Organic Question */}
                  <CarouselItem>
                    <FieldSet>
                      <h2 className="mt-23">
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
                      <h2 className="mt-23">
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
                      <h2 className="mt-23">
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
                      <div className="flex h-full flex-col justify-center items-center md:items-start gap-6">
                        <h1 className="text-4xl lg:text-5xl">
                          {t('results.matchTitle')}
                        </h1>
                        <p className="text-md md:text-lg">
                          {t('results.matchBody')}
                        </p>
                        <SubmitButton
                          className="max-w-50 ml-1 rounded-full py-6 mt-4"
                          buttonText="Join Us"
                          onClickFunction={onSubmit}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-center gap-6 items-center md:items-start mx-auto">
                        <h1 className="text-2xl md:text-3xl max-w-[280px] sm:max-w-[360px] lg:max-w-[420px]">
                          {t('results.noMatchTitle')}
                        </h1>
                        <p className="text-sm md:text-normal max-w-[280px] sm:max-w-[360px] lg:max-w-[420px]">
                          {t('results.noMatchBody')}
                        </p>
                        <p className="text-sm md:text-normal max-w-[280px] sm:max-w-[360px] lg:max-w-[420px]">
                          Share your Instagram handle to get another look at
                          your application:
                        </p>
                        <Input
                          className="border-[#848484]/80 border-1 w-full max-w-[280px] sm:max-w-[355px]"
                          type="text"
                          // {...register('instagramHandle')}
                        />
                        <SubmitButton
                          className="max-w-50 ml-1 rounded-full py-6 mt-2"
                          buttonText="Submit"
                          onClickFunction={() => {}}
                        />
                      </div>
                    )}
                  </CarouselItem>
                </CarouselContent>
                <div className="flex flex-col gap-2 mb-5">
                  <p className="text-xs font-thin">
                    By continuing, you agree to the{' '}
                    <Link
                      href="/account-agreement"
                      className="underline font-normal"
                    >
                      Todd Account Agreement
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline font-normal">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                  <p className="text-xs font-thin">
                    <Link href="/terms" className="underline font-normal">
                      Terms of Service
                    </Link>{' '}
                    apply.
                  </p>
                </div>

                <div className="flex min-h-10 justify-between flex-col lg:flex-row gap-4 lg:gap-0">
                  {slide !== 0 && slide !== totalSlides - 1 ? (
                    <FadeIn>
                      <Button
                        variant="outline"
                        className="rounded-full h-auto px-16 py-3 max-w-45 text-sm hover:cursor-pointer hover:border-[#848484]/80 font-semibold"
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
                        variant="brand"
                        className="rounded-full text-background h-auto px-13 py-3 max-w-45 text-sm hover:cursor-pointer font-semibold"
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
