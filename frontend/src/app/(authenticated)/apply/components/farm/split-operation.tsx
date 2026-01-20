// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function SplitOperation({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <div className="flex flex-row justify-between">
      <FieldLabel>
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
          <>
            <Field>
              <FieldLabel htmlFor="organicAndConventional">
                Grow both organic and conventional crops in the same parcel
              </FieldLabel>
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
            </Field>
            <Field>
              <FieldLabel htmlFor="identicalCrops">
                Grow identical crops organically and conventionally in seperate
                parcels
              </FieldLabel>
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
            </Field>
            <Field>
              <FieldLabel htmlFor="exemptProductionZones">
                Grow identical crops organically and conventionally in seperate
                parcels
              </FieldLabel>
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
            </Field>
          </>
        )}
      />
    </div>
  );
}
