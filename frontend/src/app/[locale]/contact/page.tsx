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
} from '@/components/ui/carousel';
import ContactFormItem from './components/contact-form-item';
import { Input } from '@/components/ui/input';
import { submitEmail } from '../careers/action';
import isWorkEmail from '@/lib/utils/is-work-email';
import { Button } from '@/components/ui';
import { ContactFormData } from './types';
import Fade from 'embla-carousel-fade';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';

export default function Contact() {
  const t = useTranslations('contactPage');
  const [state, submitEmailAction] = useActionState(submitEmail, null);
  const [slide, setSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(-1);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    farmName: '',
    email: '',
    phone: '',
    isOrganic: false,
  });
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    setTotalSlides(api.slideNodes().length);
    setSlide(api.selectedScrollSnap());

    api.on('select', () => setSlide(api.selectedScrollSnap()));
    api.on('slidesChanged', () => setTotalSlides(api.slideNodes().length));
  }, [api]);

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBack() {
    api?.scrollPrev();
  }

  function handleNext() {
    if (!api) return;

    if (slide === 0) {
      const isValid =
        formData.firstName &&
        formData.lastName &&
        formData.farmName &&
        formData.email &&
        formData.phone;

      if (isValid) {
        api.scrollNext();
        setFormErrorMessage(null);
      } else {
        setFormErrorMessage(t('errors.requiredFields'));
      }
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
        opts={{ duration: 30 }}
      >
        <CarouselContent>
          <ContactFormItem>
            <FormErrorMessage errorMessage={formErrorMessage} />

            <FieldSet className="gap-4 flex flex-col">
              {/** Honeypot */}
              <Field className="hidden">
                <FieldLabel>{t('fields.name')}</FieldLabel>
                <Input
                  placeholder={t('placeholders.name')}
                  name="name"
                  type="text"
                  onChange={handleFormChange}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>{t('fields.firstName')}</FieldLabel>
                  <Input
                    placeholder={t('placeholders.firstName')}
                    name="firstName"
                    required
                    onChange={handleFormChange}
                  />
                </Field>

                <Field>
                  <FieldLabel>{t('fields.lastName')}</FieldLabel>
                  <Input
                    placeholder={t('placeholders.lastName')}
                    name="lastName"
                    required
                    onChange={handleFormChange}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>{t('fields.farmName')}</FieldLabel>
                <Input
                  placeholder={t('placeholders.farmName')}
                  name="farmName"
                  required
                  onChange={handleFormChange}
                />
              </Field>

              <Field>
                <FieldLabel>{t('fields.email')}</FieldLabel>
                <Input
                  placeholder={t('placeholders.email')}
                  name="email"
                  type="email"
                  required
                  onChange={handleFormChange}
                />
              </Field>

              <Field>
                <FieldLabel>{t('fields.phone')}</FieldLabel>
                <Input
                  placeholder={t('placeholders.phone')}
                  name="phone"
                  type="tel"
                  required
                  onChange={handleFormChange}
                />
              </Field>
            </FieldSet>
          </ContactFormItem>

          {!isWorkEmail(formData.email) && (
            <ContactFormItem>
              <FieldSet>
                <Field>
                  <FieldLabel>
                    {t('questions.website', { farm: formData.farmName })}
                  </FieldLabel>
                  <Input
                    placeholder={t('placeholders.website')}
                    name="website"
                    onChange={handleFormChange}
                  />
                </Field>
              </FieldSet>
            </ContactFormItem>
          )}

          <ContactFormItem>
            <FieldSet>
              <h2>{t('questions.organic', { farm: formData.farmName })}</h2>

              <div className="flex gap-8">
                <Button
                  type="button"
                  className="text-lg hover:cursor-pointer text-underline"
                  onClick={() => {
                    setFormData({ ...formData, isOrganic: true });
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.yes')}
                </Button>

                <Button
                  type="button"
                  className="text-lg hover:cursor-pointer text-underline"
                  onClick={() => {
                    setFormData({ ...formData, isOrganic: false });
                    api?.scrollNext();
                  }}
                >
                  {t('buttons.no')}
                </Button>
              </div>
            </FieldSet>
          </ContactFormItem>

          <ContactFormItem>
            {isWorkEmail(formData.email) || formData.website ? (
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
          </ContactFormItem>
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
