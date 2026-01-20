// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function IrrigationWaterSource({
  control,
  errors,
}: FarmFormControlProps) {
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
          <FieldSet className="flex flex-col gap-4">
            {/* Well */}
            <Field>
              <FieldLabel htmlFor="well">Well</FieldLabel>
              <Checkbox
                checked={field.value?.well}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    well: e,
                  })
                }
              />
            </Field>

            {/* Reservoir */}
            <Field>
              <FieldLabel htmlFor="reservoir">Reservoir</FieldLabel>
              <Checkbox
                checked={field.value?.reservoir}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    reservoir: e,
                  })
                }
              />
            </Field>

            {/* Water district */}
            <Field>
              <FieldLabel htmlFor="waterDistrict">Water district</FieldLabel>
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
              {field.value?.waterDistrict?.isWaterDistrict && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="districtName">
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
                  </Field>
                  <Field>
                    <FieldLabel>
                      Does your cropland share irrigation lines or irrigation
                      water (including tail water) with other cropland?
                    </FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="sharesIrrigationYes">
                          Yes, describe:
                        </FieldLabel>
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
                                  ...field.value?.waterDistrict
                                    ?.sharesIrrigation,
                                  yes: {
                                    ...field.value?.waterDistrict
                                      ?.sharesIrrigation?.yes,
                                    isYes: e,
                                  },
                                  no: e
                                    ? false
                                    : field.value?.waterDistrict
                                        ?.sharesIrrigation?.no,
                                },
                              },
                            })
                          }
                        />
                        {field.value?.waterDistrict?.sharesIrrigation?.yes
                          ?.isYes && (
                          <Input
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
                        )}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="sharesIrrigationNo">No</FieldLabel>
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
                                  ...field.value?.waterDistrict
                                    ?.sharesIrrigation,
                                  no: e,
                                  yes: e
                                    ? { isYes: false, description: '' }
                                    : field.value?.waterDistrict
                                        ?.sharesIrrigation?.yes,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                    </FieldSet>
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Fish bearing river, stream, or lake */}
            <Field>
              <FieldLabel htmlFor="fishBearingWater">
                Fish bearing river, stream, or lake
              </FieldLabel>
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
              {field.value?.fishBearingWater?.isFishBearingWater && (
                <FieldSet className="ml-6 flex flex-col gap-2">
                  <Field>
                    <FieldLabel htmlFor="waterBodyName">
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
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Effluent */}
            <Field>
              <FieldLabel htmlFor="effluent">Effluent</FieldLabel>
              <Checkbox
                checked={field.value?.effluent}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    effluent: e,
                  })
                }
              />
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
