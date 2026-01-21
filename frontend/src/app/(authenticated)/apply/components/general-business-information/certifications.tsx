// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { GeneralBusinessInformationInsert } from '../../types';

export default function Certifications({
  control,
  errors,
  watch,
  register,
}: {
  control: Control<GeneralBusinessInformationInsert>;
  errors: FieldErrors<GeneralBusinessInformationInsert>;
  watch: UseFormWatch<GeneralBusinessInformationInsert>;
  register: UseFormRegister<GeneralBusinessInformationInsert>;
}) {
  return (
    <>
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
            <>
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
            </>
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
          )}
        </Field>
      </FieldSet>
    </>
  );
}
