// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { saveGeneralBusinessInformation } from '../actions';
import {
  type GeneralBusinessInformationInsert,
  generalBusinessInformationInsertSchema,
} from '../types';
import { ApplicationContext } from './application-tabs';
import { Address, Certifications } from './general-business-information/index';

/** The 1st tab in the application page for general business information */
export default function GeneralBusinessInformation() {
  const { farmInfo, setCurrentTab, canEditFarm } =
    useContext(ApplicationContext);
  const defaultValues = farmInfo;
  const methods = useForm<GeneralBusinessInformationInsert>({
    defaultValues: defaultValues ?? {},
    resolver: zodResolver(generalBusinessInformationInsertSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  async function save(formData: GeneralBusinessInformationInsert) {
    if (!canEditFarm) {
      return;
    }

    await saveGeneralBusinessInformation(formData);
  }

  async function onChangeHelper() {
    if (!canEditFarm) {
      return;
    }

    const delay = 5 * 1000;
    if (new Date().getTime() - lastSaved.getTime() > delay) {
      handleSubmit(save)();
      setLastSaved(new Date());
    }
  }

  return (
    <div className="mt-6">
      <FormProvider {...methods}>
        <form
          className={cn(
            'mt-6 flex max-w-3xl flex-col gap-6',
            !canEditFarm && 'pointer-events-none opacity-70'
          )}
          onSubmit={() => {
            handleSubmit(save)();
            setCurrentTab('colleagues');
            scrollTo(0, 0);
          }}
          onChange={onChangeHelper}
        >
          {!canEditFarm && (
            <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
              Viewers can review this section but cannot edit it.
            </p>
          )}
          <h2 className="text-lg font-semibold">Business Information</h2>
          <FieldSet className="flex flex-col gap-6">
            <Field>
              <div className="flex flex-row justify-between mb-[-6px]">
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
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                placeholder="Enter your legal business name"
                {...register('businessName')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between mb-[-6px]">
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
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                placeholder="Enter your informal or DBA name"
                {...register('informalName')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between mb-[-6px]">
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
                className="border-[#848484]/80 border-1 bg-transparent"
                type="url"
                placeholder="https://example.com"
                {...register('businessWebsite')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between mb-[-6px]">
                <FieldLabel>
                  When did you begin managing this parcel?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="managementStartDate"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="border-[#848484]/80 border-1 bg-transparent"
                type="date"
                {...register('managementStartDate')}
              />
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
          />

          <Certifications />

          {canEditFarm && (
            <SubmitButton
              className="bg-black text-white hover:cursor-pointer hover:bg-black/80 rounded-full h-11 w-[200px]"
              buttonText="Save & Next"
              reactHookFormPending={isSubmitting}
            ></SubmitButton>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
