// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlWithFarmNameProps } from '../../types';

export default function NearContaminationSource({
  control,
  errors,
  farmName = 'The farm',
}: FarmFormControlWithFarmNameProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          Is {farmName} near conventional agriculture or mining that may present
          the potential for contamination?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="nearContaminationSource"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="nearContaminationSource"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            {/* No */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.no}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    no: e,
                    yes: e
                      ? { isYes: false, description: '' }
                      : field.value?.yes,
                  })
                }
              />
              <FieldLabel
                htmlFor="contaminationNo"
                className="whitespace-nowrap"
              >
                No
              </FieldLabel>
            </Field>

            {/* Yes */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.yes?.isYes}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    no: e ? false : field.value?.no,
                    yes: {
                      ...field.value?.yes,
                      isYes: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="contaminationYes">Yes, describe:</FieldLabel>
            </Field>
            {field.value?.yes?.isYes && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                <FieldLabel>
                  Describe all adjacent land uses and buffer zones surrounding
                  this parcel
                </FieldLabel>
                <Textarea
                  placeholder="Describe adjacent land uses and buffer zones"
                  value={field.value?.yes?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      yes: {
                        ...field.value?.yes,
                        description: e.target.value,
                      },
                    })
                  }
                />
                <div>
                  <FieldLabel htmlFor="bufferZones" className="mb-2">
                    Describe the non-crop buffer zones on the perimeter of the
                    farm:
                  </FieldLabel>
                  <Textarea
                    placeholder="Describe the non-crop buffer zones"
                    value={field.value?.yes?.bufferZones ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        yes: {
                          ...field.value?.yes,
                          bufferZones: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <FieldLabel className="mb-4">
                    What measures are in place to prevent or otherwise avoid
                    contamination?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.yes?.measures?.writtenNotification
                        }
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                writtenNotification: e,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="writtenNotification">
                        Written notification to neighbors
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.yes?.measures?.writtenAgreementNeighbor
                        }
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                writtenAgreementNeighbor: e,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="writtenAgreementNeighbor">
                        Written agreement with neighbor (attach)
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={field.value?.yes?.measures?.driftMonitoring}
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                driftMonitoring: e,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="driftMonitoring">
                        Register with a drift monitoring program such as
                        DriftWatch
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.yes?.measures?.writtenAgreementAgency
                        }
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                writtenAgreementAgency: e,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="writtenAgreementAgency">
                        Written agreement with agency managing weed control
                        along roadways (i.e. county road dept) (attach)
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={field.value?.yes?.measures?.postSigns}
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                postSigns: e,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel
                        htmlFor="postSigns"
                        className="whitespace-nowrap"
                      >
                        Post signs
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={field.value?.yes?.measures?.residueTesting}
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                residueTesting: e,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="residueTesting">
                        3rd party residue testing for monitoring
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.yes?.measures?.managesAdjacentLand
                            ?.isManagesAdjacentLand
                        }
                        onCheckedChange={(e) =>
                          field.onChange({
                            ...field.value,
                            yes: {
                              ...field.value?.yes,
                              measures: {
                                ...field.value?.yes?.measures,
                                managesAdjacentLand: {
                                  ...field.value?.yes?.measures
                                    ?.managesAdjacentLand,
                                  isManagesAdjacentLand: e,
                                },
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="managesAdjacentLand">
                        My operation manages the adjacent non-organic land and
                        takes precautions to avoid drift (describe):
                      </FieldLabel>
                    </Field>
                    {field.value?.yes?.measures?.managesAdjacentLand
                      ?.isManagesAdjacentLand && (
                      <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                        <Textarea
                          placeholder="Describe precautions taken"
                          value={
                            field.value?.yes?.measures?.managesAdjacentLand
                              ?.description ?? ''
                          }
                          onChange={(e) =>
                            field.onChange({
                              ...field.value,
                              yes: {
                                ...field.value?.yes,
                                measures: {
                                  ...field.value?.yes?.measures,
                                  managesAdjacentLand: {
                                    ...field.value?.yes?.measures
                                      ?.managesAdjacentLand,
                                    description: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FieldSet>
        )}
      />
    </Field>
  );
}
