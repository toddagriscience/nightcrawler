// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';
import { Textarea } from '@/components/ui/textarea';

export default function FarmActivities({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <div className="flex flex-col justify-between">
      <FieldLabel className="mb-4">
        What activities have occurred at the farm during the past three years?
      </FieldLabel>
      <ErrorMessage
        errors={errors}
        name="farmActivites"
        render={({ message }) => <FormErrorMessage errorMessage={message} />}
      />
      <Controller
        control={control}
        name="farmActivites"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.fallow.isFallow}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    fallow: { ...field.value?.fallow, isFallow: e },
                  })
                }
              />
              <FieldLabel
                htmlFor="alternateFarmingPast"
                className="whitespace-nowrap"
              >
                Fallow
              </FieldLabel>
            </Field>
            {field.value?.fallow.isFallow && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.fallow.from || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      fallow: {
                        ...field.value?.fallow,
                        from: e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.fallow?.to || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      fallow: {
                        ...field.value?.fallow,
                        to: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.coverCropping?.isCoverCropping}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    coverCropping: {
                      ...field.value?.coverCropping,
                      isCoverCropping: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="coverCropping" className="whitespace-nowrap">
                Cover Cropping
              </FieldLabel>
            </Field>
            {field.value?.coverCropping?.isCoverCropping && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.coverCropping?.from || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      coverCropping: {
                        ...field.value?.coverCropping,
                        from: e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.coverCropping?.to || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      coverCropping: {
                        ...field.value?.coverCropping,
                        to: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="List crops..."
                  value={field.value?.coverCropping?.crops ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      coverCropping: {
                        ...field.value?.coverCropping,
                        crops: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.pasture?.isPasture}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    pasture: { ...field.value?.pasture, isPasture: e },
                  })
                }
              />
              <FieldLabel htmlFor="pasture" className="whitespace-nowrap">
                Pasture
              </FieldLabel>
            </Field>
            {field.value?.pasture?.isPasture && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.pasture?.from || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      pasture: {
                        ...field.value?.pasture,
                        from: e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.pasture?.to || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      pasture: {
                        ...field.value?.pasture,
                        to: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="List crops..."
                  value={field.value?.pasture?.crops ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      pasture: {
                        ...field.value?.pasture,
                        crops: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.productionOfCrops?.isProductionOfCrops}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    productionOfCrops: {
                      ...field.value?.productionOfCrops,
                      isProductionOfCrops: e,
                    },
                  })
                }
              />
              <FieldLabel
                htmlFor="productionOfCrops"
                className="whitespace-nowrap"
              >
                Production of Crops
              </FieldLabel>
            </Field>
            {field.value?.productionOfCrops?.isProductionOfCrops && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.productionOfCrops?.from || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      productionOfCrops: {
                        ...field.value?.productionOfCrops,
                        from: e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.productionOfCrops?.to || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      productionOfCrops: {
                        ...field.value?.productionOfCrops,
                        to: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="List crops..."
                  value={field.value?.productionOfCrops?.crops ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      productionOfCrops: {
                        ...field.value?.productionOfCrops,
                        crops: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.other?.isOther}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    other: { ...field.value?.other, isOther: e },
                  })
                }
              />
              <FieldLabel htmlFor="other" className="whitespace-nowrap">
                Other
              </FieldLabel>
            </Field>
            {field.value?.other?.isOther && (
              <FieldSet className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.other?.from || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      other: {
                        ...field.value?.other,
                        from: e.target.value,
                      },
                    })
                  }
                />
                <span>to</span>
                <Input
                  className="basis-1/4"
                  type="date"
                  value={field.value?.other?.to || ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      other: {
                        ...field.value?.other,
                        to: e.target.value,
                      },
                    })
                  }
                />
                <Textarea
                  placeholder="Describe the activites that occurred"
                  value={field.value?.other?.crops ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      other: {
                        ...field.value?.other,
                        crops: e.target.value,
                      },
                    })
                  }
                />
              </FieldSet>
            )}
          </FieldSet>
        )}
      />
    </div>
  );
}
