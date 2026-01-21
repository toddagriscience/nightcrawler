// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
          <FieldSet className="flex flex-col gap-2">
            {/* My operation performs the harvest */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.operationPerformsHarvest}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    operationPerformsHarvest: e,
                  })
                }
              />
              <FieldLabel htmlFor="operationPerformsHarvest">
                My operation performs the harvest.
              </FieldLabel>
            </Field>

            {/* Contract harvester */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="contractHarvester">
                My operation (or my contracting handler, e.g. shipper, marketer,
                buyer) hires a contract harvester to harvest my crop
              </FieldLabel>
            </Field>
            {field.value?.contractHarvester?.isContractHarvester && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="harvesterNameAddress" className="mb-2">
                    Name and address of contract harvester
                  </FieldLabel>
                  <Textarea
                    placeholder="Enter name and address"
                    value={field.value?.contractHarvester?.nameAndAddress ?? ''}
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
                </div>
                <div>
                  <FieldLabel className="mb-4">
                    Is ownership of crops transferred before or upon delivery to
                    the facility?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.contractHarvester?.ownershipTransfer?.yes
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
                      <FieldLabel
                        htmlFor="ownershipTransferYes"
                        className="whitespace-nowrap"
                      >
                        Yes
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={
                          field.value?.contractHarvester?.ownershipTransfer?.no
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
                      <FieldLabel
                        htmlFor="ownershipTransferNo"
                        className="whitespace-nowrap"
                      >
                        No
                      </FieldLabel>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="otherResponsibility">
                Other responsibility for harvest, describe:
              </FieldLabel>
            </Field>
            {field.value?.otherResponsibility?.isOtherResponsibility && (
              <div className="mb-4 ml-4 flex flex-row flex-wrap items-center gap-3">
                <Textarea
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
              </div>
            )}

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
              <FieldLabel htmlFor="notApplicable">
                Not applicable, no responsibility for harvest (e.g. crop is sold
                &quot;in the field&quot;). Describe:
              </FieldLabel>
            </Field>
            {field.value?.notApplicable?.isNotApplicable && (
              <div className="mb-4 ml-4 flex flex-row flex-wrap items-center gap-3">
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
