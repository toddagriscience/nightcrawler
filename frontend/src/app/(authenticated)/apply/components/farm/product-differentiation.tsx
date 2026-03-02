// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function ProductDifferentiation() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          How do you differentiate your produce to your consumers? (select all
          that apply)
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="productDifferentiation"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="productDifferentiation"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            {/* Twist Ties, Stickers or Rubber Bands */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.twistTies}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    twistTies: e,
                  })
                }
              />
              <FieldLabel htmlFor="twistTies">
                Twist Ties, Stickers or Rubber Bands
              </FieldLabel>
            </Field>

            {/* Newsletter or Delivery List */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.newsletter}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    newsletter: e,
                  })
                }
              />
              <FieldLabel htmlFor="newsletter">
                Newsletter or Delivery List
              </FieldLabel>
            </Field>

            {/* Description on Website or Marketing Material */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.websiteDescription}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    websiteDescription: e,
                  })
                }
              />
              <FieldLabel htmlFor="websiteDescription">
                Description on Website or Marketing Material
              </FieldLabel>
            </Field>

            {/* Signage */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.signage}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    signage: e,
                  })
                }
              />
              <FieldLabel htmlFor="signage">Signage </FieldLabel>
            </Field>

            {/* Other */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.other?.isOther}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    other: {
                      ...field.value?.other,
                      isOther: e,
                    },
                  })
                }
              />
              <FieldLabel
                htmlFor="differentiationOther"
                className="whitespace-nowrap"
              >
                Other, describe:
              </FieldLabel>
            </Field>
            {field.value?.other?.isOther && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe other differentiation method"
                  value={field.value?.other?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      other: {
                        ...field.value?.other,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            {/* Not applicable */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.notApplicable?.isNotApplicable}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    notApplicable: {
                      ...field.value?.notApplicable,
                      isNotApplicable: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="differentiationNotApplicable">
                Not applicable, describe:
              </FieldLabel>
            </Field>
            {field.value?.notApplicable?.isNotApplicable && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe why not applicable"
                  value={field.value?.notApplicable?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      notApplicable: {
                        ...field.value?.notApplicable,
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
