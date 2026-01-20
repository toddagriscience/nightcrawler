// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function FarmActivities({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <div className="flex flex-row justify-between">
      <FieldLabel>
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
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="alternateFarmingPast">Fallow</FieldLabel>
              <Checkbox
                checked={field.value?.fallow.isFallow}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    fallow: { ...field.value?.fallow, isFallow: e },
                  })
                }
              />
              {field.value?.fallow.isFallow && (
                <>
                  <Input
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

                  <Input
                    value={field.value?.fallow?.crops ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        fallow: {
                          ...field.value?.fallow,
                          crops: e.target.value,
                        },
                      })
                    }
                  />
                </>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="coverCropping">Cover Cropping</FieldLabel>
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
              {field.value?.coverCropping?.isCoverCropping && (
                <>
                  <Input
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
                </>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="pasture">Pasture</FieldLabel>
              <Checkbox
                checked={field.value?.pasture?.isPasture}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    pasture: { ...field.value?.pasture, isPasture: e },
                  })
                }
              />
              {field.value?.pasture?.isPasture && (
                <>
                  <Input
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
                </>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="productionOfCrops">
                Production of Crops
              </FieldLabel>
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
              {field.value?.productionOfCrops?.isProductionOfCrops && (
                <>
                  <Input
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
                </>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="other">Other</FieldLabel>
              <Checkbox
                checked={field.value?.other?.isOther}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    other: { ...field.value?.other, isOther: e },
                  })
                }
              />
              {field.value?.other?.isOther && (
                <>
                  <Input
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

                  <Input
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
                </>
              )}
            </Field>
          </FieldSet>
        )}
      />
    </div>
  );
}
