// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface ProductionLocationProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
}

export default function ProductionLocation({
  control,
  errors,
}: ProductionLocationProps) {
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
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="notApplicable">Not applicable</FieldLabel>
              <Checkbox
                checked={field.value?.notApplicable}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    notApplicable: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="greenhouse">Greenhouse</FieldLabel>
              <Checkbox
                checked={field.value?.greenhouse?.isGreenhouse}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    greenhouse: { ...field.value?.greenhouse, isGreenhouse: e },
                  })
                }
              />
              {field.value?.greenhouse?.isGreenhouse && (
                <Input
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
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="shadehouse">Shadehouse</FieldLabel>
              <Checkbox
                checked={field.value?.shadehouse?.isShadehouse}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    shadehouse: { ...field.value?.shadehouse, isShadehouse: e },
                  })
                }
              />
              {field.value?.shadehouse?.isShadehouse && (
                <Input
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
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="buildings">Buildings</FieldLabel>
              <Checkbox
                checked={field.value?.buildings?.isBuildings}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    buildings: { ...field.value?.buildings, isBuildings: e },
                  })
                }
              />
              {field.value?.buildings?.isBuildings && (
                <Input
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
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="otherLocation">Other</FieldLabel>
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
                <Input
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
              )}
            </Field>
            <Field>
              <FieldLabel>
                Does your operation also have conventional production in
                greenhouses, shadehouses, or buildings?
              </FieldLabel>
              <Field>
                <FieldLabel htmlFor="conventionalProductionYes">
                  Yes, organic and nonorganic production take place in adjacent
                  growing areas (e.g. adjacent structures)
                </FieldLabel>
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
              </Field>
              <Field>
                <FieldLabel htmlFor="conventionalProductionNo">No</FieldLabel>
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
              </Field>
              <Field>
                <FieldLabel htmlFor="conventionalProductionOther">
                  Other, describe:
                </FieldLabel>
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
                {field.value?.conventionalProduction?.isOther && (
                  <Input
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
                )}
              </Field>
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
