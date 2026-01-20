// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface BrandingProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
}

export default function Branding({ control, errors }: BrandingProps) {
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
          <FieldSet className="flex flex-col gap-4">
            {/* Not applicable */}
            <Field>
              <FieldLabel htmlFor="brandingNotApplicable">
                Not applicable, no branded labels or packaging, or only pack
                into my operation&apos;s own labels/brand
              </FieldLabel>
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
            </Field>

            {/* Yes */}
            <Field>
              <FieldLabel htmlFor="brandingYes">Yes</FieldLabel>
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
              {field.value?.yes?.isYes && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  <FieldLabel>
                    Indicate the certification status for each company whose
                    brand(s) your crops are packed into. Mark all that apply.
                  </FieldLabel>
                  <Field>
                    <FieldLabel htmlFor="uncertified">Uncertified</FieldLabel>
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
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="organicBiodynamic">
                      Organic, Biodynamic or Regenerative Organic Certification
                    </FieldLabel>
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
                  </Field>
                </FieldSet>
              )}
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
