// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function ProductDifferentiation({
  control,
  errors,
}: FarmFormControlProps) {
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
          <FieldSet className="flex flex-col gap-4">
            {/* Twist Ties, Stickers or Rubber Bands */}
            <Field>
              <FieldLabel htmlFor="twistTies">
                Twist Ties, Stickers or Rubber Bands (upload sample)
              </FieldLabel>
              <Checkbox
                checked={field.value?.twistTies}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    twistTies: e,
                  })
                }
              />
            </Field>

            {/* Newsletter or Delivery List */}
            <Field>
              <FieldLabel htmlFor="newsletter">
                Newsletter or Delivery List (upload sample)
              </FieldLabel>
              <Checkbox
                checked={field.value?.newsletter}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    newsletter: e,
                  })
                }
              />
            </Field>

            {/* Description on Website or Marketing Material */}
            <Field>
              <FieldLabel htmlFor="websiteDescription">
                Description on Website or Marketing Material (upload sample)
              </FieldLabel>
              <Checkbox
                checked={field.value?.websiteDescription}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    websiteDescription: e,
                  })
                }
              />
            </Field>

            {/* Signage */}
            <Field>
              <FieldLabel htmlFor="signage">Signage (upload sample)</FieldLabel>
              <Checkbox
                checked={field.value?.signage}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    signage: e,
                  })
                }
              />
            </Field>

            {/* Other */}
            <Field>
              <FieldLabel htmlFor="differentiationOther">
                Other, describe:
              </FieldLabel>
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
              {field.value?.other?.isOther && (
                <Input
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
              )}
            </Field>

            {/* Not applicable */}
            <Field>
              <FieldLabel htmlFor="differentiationNotApplicable">
                Not applicable, describe:
              </FieldLabel>
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
              {field.value?.notApplicable?.isNotApplicable && (
                <Input
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
              )}
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
