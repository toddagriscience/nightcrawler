// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function ManageHarvests({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>How do you manage your harvests?</FieldLabel>
        <ErrorMessage
          errors={errors}
          name="manageHarvests"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="manageHarvests"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-4">
            {/* My operation performs the harvest */}
            <Field>
              <FieldLabel htmlFor="operationPerformsHarvest">
                My operation performs the harvest.
              </FieldLabel>
              <Checkbox
                checked={field.value?.operationPerformsHarvest}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    operationPerformsHarvest: e,
                  })
                }
              />
            </Field>

            {/* Contract harvester */}
            <Field>
              <FieldLabel htmlFor="contractHarvester">
                My operation (or my contracting handler, e.g. shipper, marketer,
                buyer) hires a contract harvester to harvest my crop
              </FieldLabel>
              <Checkbox
                checked={field.value?.contractHarvester?.isContractHarvester}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    contractHarvester: {
                      ...field.value?.contractHarvester,
                      isContractHarvester: e,
                    },
                  })
                }
              />
              {field.value?.contractHarvester?.isContractHarvester && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="harvesterNameAddress">
                      Name and address of contract harvester
                    </FieldLabel>
                    <Input
                      placeholder="Enter name and address"
                      value={
                        field.value?.contractHarvester?.nameAndAddress ?? ''
                      }
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          contractHarvester: {
                            ...field.value?.contractHarvester,
                            nameAndAddress: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>
                      Is ownership of crops transferred before or upon delivery
                      to the facility?
                    </FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="ownershipTransferYes">
                          Yes
                        </FieldLabel>
                        <Checkbox
                          checked={
                            field.value?.contractHarvester?.ownershipTransfer
                              ?.yes
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              contractHarvester: {
                                ...field.value?.contractHarvester,
                                ownershipTransfer: {
                                  ...field.value?.contractHarvester
                                    ?.ownershipTransfer,
                                  yes: e,
                                  no: e
                                    ? false
                                    : field.value?.contractHarvester
                                        ?.ownershipTransfer?.no,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="ownershipTransferNo">
                          No
                        </FieldLabel>
                        <Checkbox
                          checked={
                            field.value?.contractHarvester?.ownershipTransfer
                              ?.no
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              contractHarvester: {
                                ...field.value?.contractHarvester,
                                ownershipTransfer: {
                                  ...field.value?.contractHarvester
                                    ?.ownershipTransfer,
                                  no: e,
                                  yes: e
                                    ? false
                                    : field.value?.contractHarvester
                                        ?.ownershipTransfer?.yes,
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

            {/* Other responsibility */}
            <Field>
              <FieldLabel htmlFor="otherResponsibility">
                Other responsibility for harvest, describe:
              </FieldLabel>
              <Checkbox
                checked={
                  field.value?.otherResponsibility?.isOtherResponsibility
                }
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    otherResponsibility: {
                      ...field.value?.otherResponsibility,
                      isOtherResponsibility: e,
                    },
                  })
                }
              />
              {field.value?.otherResponsibility?.isOtherResponsibility && (
                <Input
                  placeholder="Describe other responsibility for harvest"
                  value={field.value?.otherResponsibility?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      otherResponsibility: {
                        ...field.value?.otherResponsibility,
                        description: e.target.value,
                      },
                    })
                  }
                />
              )}
            </Field>

            {/* Not applicable */}
            <Field>
              <FieldLabel htmlFor="notApplicable">
                Not applicable, no responsibility for harvest (e.g. crop is sold
                &quot;in the field&quot;). Describe:
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
