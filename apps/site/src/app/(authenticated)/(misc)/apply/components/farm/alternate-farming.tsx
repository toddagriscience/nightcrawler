// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

export default function AlternateFarming() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <div className="flex flex-col justify-between">
      <FieldLabel className="mb-4 text-base leading-tight">
        Does your operation alternate organic and conventional farming?
      </FieldLabel>
      <ErrorMessage
        errors={errors}
        name="alternateFarming"
        render={({ message }) => <FormErrorMessage errorMessage={message} />}
      />
      <Controller
        control={control}
        name="alternateFarming"
        render={({ field }) => (
          <FieldSet className="gap-2">
            <Field orientation={'horizontal'}>
              <Checkbox
                id="alternateFarmingNo"
                checked={field.value?.no}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    no: e,
                  })
                }
              />
              <FieldLabel htmlFor="alternateFarmingNo">No</FieldLabel>
            </Field>
            <Field orientation={'horizontal'}>
              <Checkbox
                id="alternateFarmingPast"
                checked={field.value?.yesInThePast}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    yesInThePast: e,
                  })
                }
              />
              <FieldLabel htmlFor="alternateFarmingPast">
                Yes, in the past
              </FieldLabel>
            </Field>
            <Field orientation={'horizontal'}>
              <Checkbox
                id="alternateFarmingCurrent"
                checked={field.value?.yesCurrently}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    yesCurrently: e,
                  })
                }
              />
              <FieldLabel htmlFor="alternateFarmingCurrent">
                Yes, we currently alternate production
              </FieldLabel>
            </Field>
          </FieldSet>
        )}
      />
    </div>
  );
}
