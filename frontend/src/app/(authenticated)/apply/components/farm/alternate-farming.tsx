// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function AlternateFarming({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <div className="flex flex-col justify-between">
      <FieldLabel className="mb-4">
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
