// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function ProductionLocation({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          Does any production take place in greenhouses, shadehouses, or
          buildings?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="productionLocation"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="productionLocation"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.notApplicable}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    notApplicable: e,
                  })
                }
              />
              <FieldLabel htmlFor="notApplicable" className="whitespace-nowrap">
                Not applicable
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.greenhouse?.isGreenhouse}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    greenhouse: { ...field.value?.greenhouse, isGreenhouse: e },
                  })
                }
              />
              <FieldLabel htmlFor="greenhouse" className="whitespace-nowrap">
                Greenhouse
              </FieldLabel>
            </Field>
            {field.value?.greenhouse?.isGreenhouse && (
              <div className="ml-6 mb-4 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe..."
                  value={field.value?.greenhouse?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      greenhouse: {
                        ...field.value?.greenhouse,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.shadehouse?.isShadehouse}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    shadehouse: { ...field.value?.shadehouse, isShadehouse: e },
                  })
                }
              />
              <FieldLabel htmlFor="shadehouse" className="whitespace-nowrap">
                Shadehouse
              </FieldLabel>
            </Field>
            {field.value?.shadehouse?.isShadehouse && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe..."
                  value={field.value?.shadehouse?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      shadehouse: {
                        ...field.value?.shadehouse,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.buildings?.isBuildings}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    buildings: { ...field.value?.buildings, isBuildings: e },
                  })
                }
              />
              <FieldLabel htmlFor="buildings" className="whitespace-nowrap">
                Buildings
              </FieldLabel>
            </Field>
            {field.value?.buildings?.isBuildings && (
              <div className="mb-4 flex flex-row ml-6 flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe..."
                  value={field.value?.buildings?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      buildings: {
                        ...field.value?.buildings,
                        description: e.target.value,
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
              <FieldLabel htmlFor="otherLocation" className="whitespace-nowrap">
                Other
              </FieldLabel>
            </Field>
            {field.value?.other?.isOther && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
                  placeholder="Describe..."
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
              </div>
            )}
            <div className="mt-4">
              <FieldLabel className="mb-4">
                Does your operation also have conventional production in
                greenhouses, shadehouses, or buildings?
              </FieldLabel>
              <div className="flex flex-col gap-2">
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.conventionalProduction?.yes}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        conventionalProduction: {
                          ...field.value?.conventionalProduction,
                          yes: e,
                          no: false,
                        },
                      })
                    }
                  />
                  <FieldLabel htmlFor="conventionalProductionYes">
                    Yes, organic and nonorganic production take place in
                    adjacent growing areas (e.g. adjacent structures)
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.conventionalProduction?.no}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        conventionalProduction: {
                          ...field.value?.conventionalProduction,
                          no: e,
                          yes: false,
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="conventionalProductionNo"
                    className="whitespace-nowrap"
                  >
                    No
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.conventionalProduction?.isOther}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        conventionalProduction: {
                          ...field.value?.conventionalProduction,
                          isOther: e,
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="conventionalProductionOther"
                    className="whitespace-nowrap"
                  >
                    Other, describe:
                  </FieldLabel>
                </Field>
                {field.value?.conventionalProduction?.isOther && (
                  <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                    <Textarea
                      placeholder="Describe..."
                      value={
                        field.value?.conventionalProduction?.otherDescription ??
                        ''
                      }
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          conventionalProduction: {
                            ...field.value?.conventionalProduction,
                            otherDescription: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </FieldSet>
        )}
      />
    </Field>
  );
}
