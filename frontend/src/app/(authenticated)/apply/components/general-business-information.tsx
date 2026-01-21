// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  type GeneralBusinessInformationInsert,
  type GeneralBusinessInformationUpdate,
  generalBusinessInformationInsertSchema,
} from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { useForm, Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Button } from '@/components/ui';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { FadeIn } from '@/components/common';
import { saveGeneralBusinessInformation } from '../actions';

/** The 1st tab in the application page for general business information */
export default function GeneralBusinessInformation({
  defaultValues,
}: {
  defaultValues?: GeneralBusinessInformationUpdate;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<GeneralBusinessInformationInsert>({
    defaultValues: defaultValues ?? {},
    resolver: zodResolver(generalBusinessInformationInsertSchema),
  });
  const [hasAddress, setHasAddress] = useState<'yes' | 'no' | 'unanswered'>(
    defaultValues?.address1 ? 'yes' : defaultValues?.apn ? 'no' : 'unanswered'
  );

  return (
    <FadeIn className="mt-6">
      <form
        className="mt-6 flex max-w-3xl flex-col gap-6"
        onSubmit={handleSubmit(saveGeneralBusinessInformation)}
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
              <FieldLabel>Management Start Date</FieldLabel>
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

        <h2 className="mt-6 text-lg font-semibold">Address Information</h2>

        <div className="gap-2">
          <h3>Does your farm have a physical address?</h3>
          <div className="flex flex-row gap-4">
            <Button
              type="button"
              onClick={() => setHasAddress('yes')}
              className={`hover:cursor-pointer ${hasAddress === 'yes' ? 'rounded-none border-b border-b-black' : ''}`}
            >
              Yes
            </Button>
            <Button
              type="button"
              onClick={() => setHasAddress('no')}
              className={`hover:cursor-pointer ${hasAddress === 'no' ? 'rounded-none border-b border-b-black' : ''}`}
            >
              No
            </Button>
          </div>
        </div>
        <FieldSet
          className={`flex flex-col gap-4 ${hasAddress !== 'unanswered' ? 'mb-6' : ''}`}
        >
          {hasAddress === 'yes' ? (
            <>
              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>Address Line 1</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="address1"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Street address"
                  {...register('address1')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>Address Line 2</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="address2"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Apt, suite, unit, etc. (optional)"
                  {...register('address2')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>Address Line 3</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="address3"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Additional address info (optional)"
                  {...register('address3')}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel>State</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="state"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="State"
                    {...register('state')}
                  />
                </Field>

                <Field>
                  <div className="flex flex-row justify-between">
                    <FieldLabel>Postal Code</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="postalCode"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="ZIP / Postal code"
                    {...register('postalCode')}
                  />
                </Field>
              </div>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>Country</FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="country"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Country"
                  {...register('country')}
                />
              </Field>
            </>
          ) : hasAddress === 'no' ? (
            <>
              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>
                    County, State (if no physical address)
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="countyState"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="e.g., Los Angeles County, California"
                  {...register('countyState')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel>
                    APN (County Assessor&apos;s Parcel Number)
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="apn"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Parcel number (if no physical address)"
                  {...register('apn')}
                />
              </Field>
            </>
          ) : null}
        </FieldSet>

        <h2 className="text-lg font-semibold">Certification Information</h2>
        <FieldSet className="mb-6 flex flex-col gap-6">
          <Field>
            <div className="flex flex-row items-center gap-3">
              <Controller
                name="hasGAP"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="hasGAP"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="hasGAP">
                Good Agriculture Practices (GAP)
              </FieldLabel>
              <ErrorMessage
                errors={errors}
                name="hasGAP"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            {watch('hasGAP') && (
              <FadeIn>
                <div className="mt-2 ml-7 flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <FieldLabel>GAP Certification Date</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="GAPDate"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input type="date" {...register('GAPDate')} />
                </div>
              </FadeIn>
            )}
          </Field>

          {/* Local/Facility Inspection */}
          <Field>
            <div className="flex flex-row items-center gap-3">
              <Controller
                name="hasLocalInspection"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="hasLocalInspection"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="hasLocalInspection">
                Local/Facility Inspection
              </FieldLabel>
              <ErrorMessage
                errors={errors}
                name="hasLocalInspection"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            {watch('hasLocalInspection') && (
              <FadeIn>
                <div className="mt-2 ml-7 flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <FieldLabel>Local Inspection Date</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="localInspectionDate"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input type="date" {...register('localInspectionDate')} />
                </div>
              </FadeIn>
            )}
          </Field>

          {/* Organic */}
          <Field>
            <div className="flex flex-row items-center gap-3">
              <Controller
                name="hasOrganic"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="hasOrganic"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="hasOrganic">Organic</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="hasOrganic"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            {watch('hasOrganic') && (
              <FadeIn>
                <div className="mt-2 ml-7 flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <FieldLabel>Organic Certification Date</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="organicDate"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input type="date" {...register('organicDate')} />
                </div>
              </FadeIn>
            )}
          </Field>

          {/* Biodynamic */}
          <Field>
            <div className="flex flex-row items-center gap-3">
              <Controller
                name="hasBiodynamic"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="hasBiodynamic"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="hasBiodynamic">Biodynamic</FieldLabel>
              <ErrorMessage
                errors={errors}
                name="hasBiodynamic"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            {watch('hasBiodynamic') && (
              <FadeIn>
                <div className="mt-2 ml-7 flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <FieldLabel>Biodynamic Certification Date</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="biodynamicDate"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input type="date" {...register('biodynamicDate')} />
                </div>
              </FadeIn>
            )}
          </Field>

          {/* Regenerative Organic */}
          <Field>
            <div className="flex flex-row items-center gap-3">
              <Controller
                name="hasRegenerativeOrganic"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="hasRegenerativeOrganic"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="hasRegenerativeOrganic">
                Regenerative Organic
              </FieldLabel>
              <ErrorMessage
                errors={errors}
                name="hasRegenerativeOrganic"
                render={({ message }) => (
                  <FormErrorMessage errorMessage={message} />
                )}
              />
            </div>
            {watch('hasRegenerativeOrganic') && (
              <FadeIn>
                <div className="mt-2 ml-7 flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <FieldLabel>Regenerative Organic Date</FieldLabel>
                    <ErrorMessage
                      errors={errors}
                      name="regenerativeOrganic"
                      render={({ message }) => (
                        <FormErrorMessage errorMessage={message} />
                      )}
                    />
                  </div>
                  <Input type="date" {...register('regenerativeOrganic')} />
                </div>
              </FadeIn>
            )}
          </Field>
        </FieldSet>
        <SubmitButton buttonText="SAVE AND NEXT"></SubmitButton>
      </form>
    </FadeIn>
  );
}
