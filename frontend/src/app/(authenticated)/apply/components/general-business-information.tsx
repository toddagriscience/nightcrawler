// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  type GeneralBusinessInformationInsert,
  type GeneralBusinessInformationUpdate,
  generalBusinessInformationInsertSchema,
  TabTypes,
} from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { useForm } from 'react-hook-form';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { FadeIn } from '@/components/common';
import { saveGeneralBusinessInformation } from '../actions';
import { Address, Certifications } from './general-business-information/index';
import { useState } from 'react';

/** The 1st tab in the application page for general business information */
export default function GeneralBusinessInformation({
  defaultValues,
  setCurrentTab,
}: {
  defaultValues?: GeneralBusinessInformationUpdate;
  setCurrentTab: (arg0: TabTypes) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GeneralBusinessInformationInsert>({
    defaultValues: defaultValues ?? {},
    resolver: zodResolver(generalBusinessInformationInsertSchema),
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  async function save(formData: GeneralBusinessInformationInsert) {
    await saveGeneralBusinessInformation(formData);
  }

  async function onChangeHelper() {
    const delay = 5 * 1000;
    if (new Date().getTime() - lastSaved.getTime() > delay) {
      handleSubmit(save)();
      setLastSaved(new Date());
    }
  }

  return (
    <FadeIn className="mt-6">
      <form
        className="mt-6 flex max-w-3xl flex-col gap-6"
        onSubmit={() => {
          handleSubmit(save)();
          setCurrentTab('colleagues');
          scrollTo(0, 0);
        }}
        onChange={onChangeHelper}
      >
        <h2 className="text-lg font-semibold">Business Information</h2>
        <FieldSet className="flex flex-col gap-6">
          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>Registered Legal Business Name</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="businessName"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input
              type="text"
              placeholder="Enter your legal business name"
              {...register('businessName')}
            />
          </Field>

          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>Informal / DBA Name</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="informalName"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input
              type="text"
              placeholder="Enter your informal or DBA name"
              {...register('informalName')}
            />
          </Field>

          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>Business Website</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="businessWebsite"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input
              type="url"
              placeholder="https://example.com"
              {...register('businessWebsite')}
            />
          </Field>

          <Field>
            <div className="flex flex-row justify-between">
              <FieldLabel>When did you begin managing this parcel?</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="managementStartDate"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            <Input type="date" {...register('managementStartDate')} />
          </Field>
        </FieldSet>

        <Address
          defaultAddressState={
            defaultValues?.address1
              ? 'yes'
              : defaultValues?.apn
                ? 'no'
                : 'unanswered'
          }
          register={register}
          errors={errors}
        />

        <Certifications
          control={control}
          errors={errors}
          watch={watch}
          register={register}
        />

        <SubmitButton
          buttonText="SAVE AND NEXT"
          reactHookFormPending={isSubmitting}
        ></SubmitButton>
      </form>
    </FadeIn>
  );
}
