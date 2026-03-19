// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Button } from '@/components/ui';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GeneralBusinessInformationInsert } from '../../types';

export default function Address({
  defaultAddressState,
}: {
  defaultAddressState: 'yes' | 'no' | 'unanswered';
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<GeneralBusinessInformationInsert>();
  const [hasAddress, setHasAddress] = useState<'yes' | 'no' | 'unanswered'>(
    defaultAddressState
  );

  return (
    <>
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
                <FieldLabel
                  htmlFor="address1"
                  className="leading-tight mb-[-6px]"
                >
                  Address Line 1
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="address1"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                placeholder="Street address"
                {...register('address1')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel
                  htmlFor="address2"
                  className="leading-tight mb-[-6px]"
                >
                  Address Line 2
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="address2"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                placeholder="Apt, suite, unit, etc. (optional)"
                {...register('address2')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel
                  htmlFor="address3"
                  className="leading-tight mb-[-6px]"
                >
                  Address Line 3
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="address3"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                placeholder="Additional address info (optional)"
                {...register('address3')}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel
                    htmlFor="state"
                    className="leading-tight mb-[-6px]"
                  >
                    State
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="state"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="State"
                  {...register('state')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel
                    htmlFor="postalCode"
                    className="leading-tight mb-[-6px]"
                  >
                    Postal Code
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="postalCode"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="ZIP / Postal code"
                  {...register('postalCode')}
                />
              </Field>
            </div>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel
                  htmlFor="country"
                  className="leading-tight mb-[-6px]"
                >
                  Country
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="country"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="border-[#848484]/80 border-1 bg-transparent"
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
                <FieldLabel
                  htmlFor="countyState"
                  className="leading-tight mb-[-6px]"
                >
                  County, State
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
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                placeholder="e.g., Los Angeles County, California"
                {...register('countyState')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel htmlFor="apn" className="leading-tight mb-[-6px]">
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
                className="border-[#848484]/80 border-1 bg-transparent"
                type="text"
                {...register('apn')}
              />
            </Field>
          </>
        ) : null}
      </FieldSet>
    </>
  );
}
