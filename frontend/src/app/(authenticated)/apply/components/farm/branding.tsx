// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function Branding({ control, errors }: FarmFormControlProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          Is your produce packed for another brand, or do you use branding owned
          by a third party?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="branding"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="branding"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            {/* Not applicable */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.notApplicable}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    notApplicable: e,
                    yes: e ? { isYes: false } : field.value?.yes,
                  })
                }
              />
              <FieldLabel htmlFor="brandingNotApplicable">
                Not applicable, no branded labels or packaging, or only pack
                into my operation&apos;s own labels/brand
              </FieldLabel>
            </Field>

            {/* Yes */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.yes?.isYes}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    notApplicable: e ? false : field.value?.notApplicable,
                    yes: {
                      ...field.value?.yes,
                      isYes: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="brandingYes" className="whitespace-nowrap">
                Yes
              </FieldLabel>
            </Field>
            {field.value?.yes?.isYes && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                <FieldLabel className="mt-4 mb-1">
                  Indicate the certification status for each company whose
                  brand(s) your crops are packed into. Mark all that apply.
                </FieldLabel>
                <div className="flex flex-col gap-2">
                  <Field orientation="horizontal">
                    <Checkbox
                      checked={
                        field.value?.yes?.certificationStatus?.uncertified
                      }
                      onCheckedChange={(e) =>
                        field.onChange({
                          ...field.value,
                          yes: {
                            ...field.value?.yes,
                            certificationStatus: {
                              ...field.value?.yes?.certificationStatus,
                              uncertified: e,
                            },
                          },
                        })
                      }
                    />
                    <FieldLabel
                      htmlFor="uncertified"
                      className="whitespace-nowrap"
                    >
                      Uncertified
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      checked={
                        field.value?.yes?.certificationStatus?.organicBiodynamic
                      }
                      onCheckedChange={(e) =>
                        field.onChange({
                          ...field.value,
                          yes: {
                            ...field.value?.yes,
                            certificationStatus: {
                              ...field.value?.yes?.certificationStatus,
                              organicBiodynamic: e,
                            },
                          },
                        })
                      }
                    />
                    <FieldLabel htmlFor="organicBiodynamic">
                      Organic, Biodynamic or Regenerative Organic Certification
                    </FieldLabel>
                  </Field>
                </div>
              </div>
            )}
          </FieldSet>
        )}
      />
    </Field>
  );
}
