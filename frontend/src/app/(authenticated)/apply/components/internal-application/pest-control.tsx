// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface PestControlProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
}

export default function PestControl({ control, errors }: PestControlProps) {
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
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="preventionPractices">
                Prevention practices are effective and additional controls are
                not needed at this time.
              </FieldLabel>
              <Checkbox
                checked={field.value?.preventionPractices}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    preventionPractices: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mechanicalOrPhysicalControls">
                Mechanical or physical controls, including traps, light, or
                sound.
              </FieldLabel>
              <Checkbox
                checked={field.value?.mechanicalOrPhysicalControls}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    mechanicalOrPhysicalControls: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="pestControlMaterials">
                Pest control materials (e.g. applied via fumigation or fogging)
              </FieldLabel>
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
              {field.value?.pestControlMaterials?.isPestControlMaterials && (
                <>
                  <Field>
                    <FieldLabel htmlFor="preventContamination">
                      Describe how you prevent pest control materials from
                      contaminating soil and crops:
                    </FieldLabel>
                    <Input
                      value={
                        field.value?.pestControlMaterials
                          ?.preventContamination ?? ''
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
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="recordPestControlUse">
                      Describe how you record pest control material use and
                      measures taken to protect organic crops:
                    </FieldLabel>
                    <Input
                      value={
                        field.value?.pestControlMaterials
                          ?.recordPestControlUse ?? ''
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
                  </Field>
                </>
              )}
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
