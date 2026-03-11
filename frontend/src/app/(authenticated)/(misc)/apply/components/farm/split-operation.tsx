// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function SplitOperation() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <div className="flex flex-col justify-between">
      <FieldLabel className="mb-4">
        A split operation is an operation that produces both organic and
        conventional crops. Mark any of the following that apply to your
        operation:
      </FieldLabel>
      <ErrorMessage
        errors={errors}
        name="splitOperation"
        render={({ message }) => <FormErrorMessage errorMessage={message} />}
      />
      <Controller
        control={control}
        name="splitOperation"
        render={({ field }) => (
          <FieldSet className="gap-2">
            <Field
              className="flex flex-row items-center gap-3"
              orientation={'horizontal'}
            >
              <Checkbox
                id="organicAndConventional"
                checked={field.value?.organicAndConventional}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    organicAndConventional: e,
                  })
                }
              />
              <FieldLabel htmlFor="organicAndConventional">
                Grow both organic and conventional crops in the same parcel
              </FieldLabel>
            </Field>
            <Field
              className="flex flex-row items-center gap-3"
              orientation={'horizontal'}
            >
              <Checkbox
                id="identicalCrops"
                checked={field.value?.identicalCrops}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    identicalCrops: e,
                  })
                }
              />
              <FieldLabel htmlFor="identicalCrops">
                Grow identical crops organically and conventionally in seperate
                parcels
              </FieldLabel>
            </Field>
            <Field
              className="flex flex-row items-center gap-3"
              orientation={'horizontal'}
            >
              <Checkbox
                id="exemptProductionZones"
                checked={field.value?.exemptProductionZones}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    exemptProductionZones: e,
                  })
                }
              />
              <FieldLabel htmlFor="exemptProductionZones">
                Grow identical crops organically and conventionally in seperate
                parcels
              </FieldLabel>
            </Field>
          </FieldSet>
        )}
      />
    </div>
  );
}
