// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function OtherMaterials() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          What, if any, synthetic fertilizers, pesticides, fungicides, or any
          other materials such as treated seed (including coatings, pelleting
          materials, and inoculants), growing media (substrate, planting mix,
          potting soil), adjuvants, etc. are used on your farm?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="otherMaterials"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="otherMaterials"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                defaultChecked={true}
                checked={field.value?.noMaterials?.isNoMaterials}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    noMaterials: {
                      ...field.value?.noMaterials,
                      isNoMaterials: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="noMaterials">
                We do not use any of the above materials
              </FieldLabel>
            </Field>
            {!field.value?.noMaterials?.isNoMaterials && (
              <div className="ml-6 mb-4 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="productName" className="mb-2">
                    Product name, including formulation:
                  </FieldLabel>
                  <Input
                    placeholder="Enter product name..."
                    value={field.value?.noMaterials?.productName ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        noMaterials: {
                          ...field.value?.noMaterials,
                          productName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="manufacturerName" className="mb-2">
                    Manufacturer name:
                  </FieldLabel>
                  <Input
                    placeholder="Enter manufacturer name..."
                    value={field.value?.noMaterials?.manufacturerName ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        noMaterials: {
                          ...field.value?.noMaterials,
                          manufacturerName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="reasonForUse" className="mb-2">
                    Reason for use:
                  </FieldLabel>
                  <Input
                    placeholder="Enter reason for use..."
                    value={field.value?.noMaterials?.reasonForUse ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        noMaterials: {
                          ...field.value?.noMaterials,
                          reasonForUse: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="lastApplication" className="mb-2">
                    Last application:
                  </FieldLabel>
                  <Input
                    type="date"
                    value={field.value?.noMaterials?.lastApplication ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        noMaterials: {
                          ...field.value?.noMaterials,
                          lastApplication: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="otherInformation" className="mb-2">
                    Other information:
                  </FieldLabel>
                  <Textarea
                    value={field.value?.noMaterials?.otherInformation ?? ''}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        noMaterials: {
                          ...field.value?.noMaterials,
                          otherInformation: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.usesNpk?.isUsesNpk}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    usesNpk: {
                      ...field.value?.usesNpk,
                      isUsesNpk: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="usesNpk">Our farm uses NPK</FieldLabel>
            </Field>
            {field.value?.usesNpk?.isUsesNpk && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe NPK usage..."
                  value={field.value?.usesNpk?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      usesNpk: {
                        ...field.value?.usesNpk,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.usesSodiumNitrate?.isUsesSodiumNitrate}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    usesSodiumNitrate: {
                      ...field.value?.usesSodiumNitrate,
                      isUsesSodiumNitrate: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="usesSodiumNitrate">
                Our farm uses sodium (Chilean) nitrate
              </FieldLabel>
            </Field>
            {field.value?.usesSodiumNitrate?.isUsesSodiumNitrate && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe sodium nitrate usage..."
                  value={field.value?.usesSodiumNitrate?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      usesSodiumNitrate: {
                        ...field.value?.usesSodiumNitrate,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.treatedLumber?.isTreatedLumber}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    treatedLumber: {
                      ...field.value?.treatedLumber,
                      isTreatedLumber: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="treatedLumber">
                There are existing installations of lumber treated with
                arsenate, describe (e.g. endpost, trellis, stakes, etc.)
              </FieldLabel>
            </Field>
            {field.value?.treatedLumber?.isTreatedLumber && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe treated lumber installations..."
                  value={field.value?.treatedLumber?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      treatedLumber: {
                        ...field.value?.treatedLumber,
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
