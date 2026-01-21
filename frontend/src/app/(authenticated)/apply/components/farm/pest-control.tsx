// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function PestControl({ control, errors }: FarmFormControlProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          What measures are taken to prevent or control pests?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="pestControl"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="pestControl"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.preventionPractices}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    preventionPractices: e,
                  })
                }
              />
              <FieldLabel htmlFor="preventionPractices">
                Prevention practices are effective and additional controls are
                not needed at this time.
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.mechanicalOrPhysicalControls}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    mechanicalOrPhysicalControls: e,
                  })
                }
              />
              <FieldLabel htmlFor="mechanicalOrPhysicalControls">
                Mechanical or physical controls, including traps, light, or
                sound.
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={
                  field.value?.pestControlMaterials?.isPestControlMaterials
                }
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    pestControlMaterials: {
                      ...field.value?.pestControlMaterials,
                      isPestControlMaterials: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="pestControlMaterials">
                Pest control materials (e.g. applied via fumigation or fogging)
              </FieldLabel>
            </Field>
            {field.value?.pestControlMaterials?.isPestControlMaterials && (
              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="preventContamination" className="mb-2">
                    Describe how you prevent pest control materials from
                    contaminating soil and crops:
                  </FieldLabel>
                  <Textarea
                    placeholder="Describe..."
                    value={
                      field.value?.pestControlMaterials?.preventContamination ??
                      ''
                    }
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        pestControlMaterials: {
                          ...field.value?.pestControlMaterials,
                          preventContamination: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="recordPestControlUse" className="mb-2">
                    Describe how you record pest control material use and
                    measures taken to protect organic crops:
                  </FieldLabel>
                  <Textarea
                    placeholder="Describe..."
                    value={
                      field.value?.pestControlMaterials?.recordPestControlUse ??
                      ''
                    }
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        pestControlMaterials: {
                          ...field.value?.pestControlMaterials,
                          recordPestControlUse: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </FieldSet>
        )}
      />
    </Field>
  );
}
