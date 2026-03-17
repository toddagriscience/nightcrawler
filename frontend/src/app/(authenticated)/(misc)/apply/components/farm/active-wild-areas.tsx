// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function ActiveWildAreas() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
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
          <FieldSet className="flex flex-col gap-2">
            {/* No */}
            <Field orientation="horizontal">
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
              <FieldLabel
                htmlFor="activeWildAreasNo"
                className="whitespace-nowrap"
              >
                No
              </FieldLabel>
            </Field>

            {/* Yes */}
            <Field orientation="horizontal">
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
              <FieldLabel
                htmlFor="activeWildAreasYes"
                className="whitespace-nowrap"
              >
                Yes, describe:
              </FieldLabel>
            </Field>
            {field.value?.yes?.isYes && (
              <div className="mb-4 ml-4 flex flex-row flex-wrap items-center gap-3">
                <FieldLabel>
                  Include soil type and condition, bodies of water, nearby
                  wetlands and woodlands, wildlife, windbreaks, hedgerows,
                  native habitat and beneficial plantings. Include any problem
                  areas such as erosion and invasive species.
                </FieldLabel>
                <Textarea
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
              </div>
            )}
          </FieldSet>
        )}
      />
    </Field>
  );
}
