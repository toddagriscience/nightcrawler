// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function IrrigationWaterSource() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          What is the source of your irrigation water? (select all that apply)
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="irrigationWaterSource"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="irrigationWaterSource"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            {/* Well */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.well}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    well: e,
                  })
                }
              />
              <FieldLabel htmlFor="well" className="whitespace-nowrap">
                Well
              </FieldLabel>
            </Field>

            {/* Reservoir */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.reservoir}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    reservoir: e,
                  })
                }
              />
              <FieldLabel htmlFor="reservoir" className="whitespace-nowrap">
                Reservoir
              </FieldLabel>
            </Field>

            {/* Water district */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.waterDistrict?.isWaterDistrict}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    waterDistrict: {
                      ...field.value?.waterDistrict,
                      isWaterDistrict: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="waterDistrict" className="whitespace-nowrap">
                Water district
              </FieldLabel>
            </Field>
            {field.value?.waterDistrict?.isWaterDistrict && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="districtName" className="mb-2">
                    Name of district:
                  </FieldLabel>
                  <Input
                    placeholder="Enter district name"
                    value={field.value?.waterDistrict?.districtName ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        waterDistrict: {
                          ...field.value?.waterDistrict,
                          districtName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <FieldLabel className="mb-4">
                    Does your cropland share irrigation lines or irrigation
                    water (including tail water) with other cropland?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.waterDistrict?.sharesIrrigation?.yes
                            ?.isYes
                        }
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            waterDistrict: {
                              ...field.value?.waterDistrict,
                              sharesIrrigation: {
                                ...field.value?.waterDistrict?.sharesIrrigation,
                                yes: {
                                  ...field.value?.waterDistrict
                                    ?.sharesIrrigation?.yes,
                                  isYes: e,
                                },
                                no: e
                                  ? false
                                  : field.value?.waterDistrict?.sharesIrrigation
                                      ?.no,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel
                        htmlFor="sharesIrrigationYes"
                        className="whitespace-nowrap"
                      >
                        Yes
                      </FieldLabel>
                    </Field>
                    {field.value?.waterDistrict?.sharesIrrigation?.yes
                      ?.isYes && (
                      <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                        <Textarea
                          placeholder="Describe shared irrigation"
                          value={
                            field.value?.waterDistrict?.sharesIrrigation?.yes
                              ?.description ?? ''
                          }
                          onChange={(e) =>
                            field.onChange({
                              ...field.value,
                              waterDistrict: {
                                ...field.value?.waterDistrict,
                                sharesIrrigation: {
                                  ...field.value?.waterDistrict
                                    ?.sharesIrrigation,
                                  yes: {
                                    ...field.value?.waterDistrict
                                      ?.sharesIrrigation?.yes,
                                    description: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.waterDistrict?.sharesIrrigation?.no
                        }
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            waterDistrict: {
                              ...field.value?.waterDistrict,
                              sharesIrrigation: {
                                ...field.value?.waterDistrict?.sharesIrrigation,
                                no: e,
                                yes: e
                                  ? { isYes: false, description: '' }
                                  : field.value?.waterDistrict?.sharesIrrigation
                                      ?.yes,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel
                        htmlFor="sharesIrrigationNo"
                        className="whitespace-nowrap"
                      >
                        No
                      </FieldLabel>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Fish bearing river, stream, or lake */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.fishBearingWater?.isFishBearingWater}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    fishBearingWater: {
                      ...field.value?.fishBearingWater,
                      isFishBearingWater: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="fishBearingWater">
                Fish bearing river, stream, or lake
              </FieldLabel>
            </Field>
            {field.value?.fishBearingWater?.isFishBearingWater && (
              <div className="mb-4 ml-6">
                <FieldLabel htmlFor="waterBodyName" className="mb-2">
                  Name of water body:
                </FieldLabel>
                <Input
                  placeholder="Enter water body name"
                  value={field.value?.fishBearingWater?.waterBodyName ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      fishBearingWater: {
                        ...field.value?.fishBearingWater,
                        waterBodyName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            {/* Effluent */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.effluent}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    effluent: e,
                  })
                }
              />
              <FieldLabel htmlFor="effluent" className="whitespace-nowrap">
                Effluent
              </FieldLabel>
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
