// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface NearContaminationSourceProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
  farmName?: string;
}

export default function NearContaminationSource({
  control,
  errors,
  farmName = 'The farm',
}: NearContaminationSourceProps) {
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
          <FieldSet className="flex flex-col gap-4">
            {/* No */}
            <Field>
              <FieldLabel htmlFor="contaminationNo">No</FieldLabel>
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
            </Field>

            {/* Yes */}
            <Field>
              <FieldLabel htmlFor="contaminationYes">
                Yes, describe: (Describe all adjacent land uses and buffer zones
                surrounding this parcel)
              </FieldLabel>
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
              {field.value?.yes?.isYes && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  <Field>
                    <Input
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
                  </Field>

                  {/* Prevention measures */}
                  <div>
                    <FieldLabel>
                      What measures are in place to prevent or otherwise avoid
                      contamination?
                    </FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="writtenNotification">
                          Written notification to neighbors
                        </FieldLabel>
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
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="writtenAgreementNeighbor">
                          Written agreement with neighbor (attach)
                        </FieldLabel>
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
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="driftMonitoring">
                          Register with a drift monitoring program such as
                          DriftWatch
                        </FieldLabel>
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
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="writtenAgreementAgency">
                          Written agreement with agency managing weed control
                          along roadways (i.e. county road dept) (attach)
                        </FieldLabel>
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
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="postSigns">Post signs</FieldLabel>
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
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="residueTesting">
                          3rd party residue testing for monitoring
                        </FieldLabel>
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
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="managesAdjacentLand">
                          My operation manages the adjacent non-organic land and
                          takes precautions to avoid drift (describe):
                        </FieldLabel>
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
                        {field.value?.yes?.measures?.managesAdjacentLand
                          ?.isManagesAdjacentLand && (
                          <Input
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
                        )}
                      </Field>
                    </FieldSet>
                  </div>

                  {/* Buffer zones description */}
                  <Field>
                    <FieldLabel htmlFor="bufferZones">
                      Describe the non-crop buffer zones on the perimeter of the
                      farm:
                    </FieldLabel>
                    <Input
                      placeholder="Describe buffer zones"
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
