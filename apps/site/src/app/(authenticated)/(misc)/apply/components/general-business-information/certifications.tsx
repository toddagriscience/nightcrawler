// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { GeneralBusinessInformationInsert } from '../../types';

export default function Certifications() {
  const {
    control,
    formState: { errors },
    watch,
    register,
  } = useFormContext<GeneralBusinessInformationInsert>();
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
            <FieldLabel htmlFor="hasGAP" className="leading-tight">
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
              <div className="mt-2 flex flex-col gap-2 w-auto">
                <div className="flex flex-row justify-between ml-6">
                  <FieldLabel
                    htmlFor="GAPDate"
                    className="leading-tight mb-[-2px]"
                  >
                    GAP Certification Date
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="GAPDate"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  type="date"
                  {...register('GAPDate')}
                  className="w-fit ml-6 border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
                />
              </div>
            </>
          )}
        </Field>

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
            <FieldLabel htmlFor="hasLocalInspection" className="leading-tight">
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
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex flex-row justify-between ml-6">
                <FieldLabel
                  htmlFor="localInspectionDate"
                  className="leading-tight mb-[-2px]"
                >
                  Local Inspection Date
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="localInspectionDate"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="date"
                {...register('localInspectionDate')}
                className="w-fit ml-6 border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
              />
            </div>
          )}
        </Field>

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
            <FieldLabel htmlFor="hasOrganic" className="leading-tight">
              Organic
            </FieldLabel>
            <ErrorMessage
              errors={errors}
              name="hasOrganic"
              render={({ message }) => (
                <FormErrorMessage errorMessage={message} />
              )}
            />
          </div>
          {watch('hasOrganic') && (
            <div className="mt-2  flex flex-col gap-2">
              <div className="flex flex-row justify-between ml-6">
                <FieldLabel
                  htmlFor="organicDate"
                  className="leading-tight mb-[-2px]"
                >
                  Organic Certification Date
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="organicDate"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="date"
                {...register('organicDate')}
                className="w-fit ml-6 border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
              />
            </div>
          )}
        </Field>

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
            <FieldLabel htmlFor="hasBiodynamic" className="leading-tight">
              Biodynamic
            </FieldLabel>
            <ErrorMessage
              errors={errors}
              name="hasBiodynamic"
              render={({ message }) => (
                <FormErrorMessage errorMessage={message} />
              )}
            />
          </div>
          {watch('hasBiodynamic') && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex flex-row justify-between ml-6">
                <FieldLabel
                  htmlFor="biodynamicDate"
                  className="leading-tight mb-[-2px]"
                >
                  Biodynamic Certification Date
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="biodynamicDate"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="date"
                {...register('biodynamicDate')}
                className="w-fit ml-6 border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
              />
            </div>
          )}
        </Field>

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
            <FieldLabel
              htmlFor="hasRegenerativeOrganic"
              className="leading-tight"
            >
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
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex flex-row justify-between ml-6">
                <FieldLabel
                  htmlFor="regenerativeOrganicDate"
                  className="leading-tight mb-[-2px]"
                >
                  Regenerative Organic Date
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="regenerativeOrganic"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="date"
                {...register('regenerativeOrganic')}
                className="w-fit ml-6 border-[#848484]/80 border-1 bg-transparent text-muted-foreground/70 font-thin"
              />
            </div>
          )}
        </Field>
      </FieldSet>
    </>
  );
}
