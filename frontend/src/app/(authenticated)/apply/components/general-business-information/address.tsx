// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { useState } from 'react';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Input } from '@/components/ui/input';
import { GeneralBusinessInformationInsert } from '../../types';
import { useFormContext } from 'react-hook-form';

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
                <Input type="text" placeholder="State" {...register('state')} />
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
                <FieldLabel>County, State (if no physical address)</FieldLabel>
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
    </>
  );
}
