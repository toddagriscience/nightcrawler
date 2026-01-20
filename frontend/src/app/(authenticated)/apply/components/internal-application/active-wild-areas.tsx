// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface ActiveWildAreasProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
}

export default function ActiveWildAreas({
  control,
  errors,
}: ActiveWildAreasProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          Are active wild areas reserved for biological diversity located on or
          near the farm?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="activeWildAreas"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="activeWildAreas"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-4">
            {/* No */}
            <Field>
              <FieldLabel htmlFor="activeWildAreasNo">No</FieldLabel>
              <Checkbox
                checked={field.value?.no}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    no: e,
                    yes: e
                      ? { isYes: false, description: '' }
                      : field.value?.yes,
                  })
                }
              />
            </Field>

            {/* Yes */}
            <Field>
              <FieldLabel htmlFor="activeWildAreasYes">
                Yes, describe:
              </FieldLabel>
              <Checkbox
                checked={field.value?.yes?.isYes}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    no: e ? false : field.value?.no,
                    yes: {
                      ...field.value?.yes,
                      isYes: e,
                    },
                  })
                }
              />
              {field.value?.yes?.isYes && (
                <Input
                  placeholder="Include soil type and condition, bodies of water, nearby wetlands and woodlands, wildlife, windbreaks, hedgerows, native habitat and beneficial plantings. Include any problem areas such as erosion and invasive species."
                  value={field.value?.yes?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      yes: {
                        ...field.value?.yes,
                        description: e.target.value,
                      },
                    })
                  }
                />
              )}
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
