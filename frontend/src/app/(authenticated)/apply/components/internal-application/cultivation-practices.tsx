// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface CultivationPracticesProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
}

export default function CultivationPractices({
  control,
  errors,
}: CultivationPracticesProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          What cultivation practices are performed to maintain or improve soil
          condition?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="cultivationPractices"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="cultivationPractices"
        render={({ field }) => (
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="manure">Manure</FieldLabel>
              <Checkbox
                checked={field.value?.manure?.isManure}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    manure: { ...field.value?.manure, isManure: e },
                  })
                }
              />
              {field.value?.manure?.isManure && (
                <Field>
                  <FieldLabel>
                    Do you apply raw animal manure (including any compost,
                    compost tea, or vermicompost containing manure is not
                    composted), and/or do you have planned grazing of animals in
                    your organic crop production areas?
                  </FieldLabel>
                  <Field>
                    <FieldLabel htmlFor="manureNo">No</FieldLabel>
                    <Checkbox
                      checked={field.value?.manure?.rawManure?.no}
                      onCheckedChange={(e) =>
                        field.onChange({
                          ...field.value,
                          manure: {
                            ...field.value?.manure,
                            rawManure: {
                              ...field.value?.manure?.rawManure,
                              no: e,
                              yes: false,
                              plannedGrazing: false,
                            },
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="manureYes">Yes</FieldLabel>
                    <Checkbox
                      checked={field.value?.manure?.rawManure?.yes}
                      onCheckedChange={(e) =>
                        field.onChange({
                          ...field.value,
                          manure: {
                            ...field.value?.manure,
                            rawManure: {
                              ...field.value?.manure?.rawManure,
                              yes: e,
                              no: false,
                              plannedGrazing: false,
                            },
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="manurePlannedGrazing">
                      Yes, my operation uses planned grazing of animals in
                      organic crop production areas
                    </FieldLabel>
                    <Checkbox
                      checked={field.value?.manure?.rawManure?.plannedGrazing}
                      onCheckedChange={(e) =>
                        field.onChange({
                          ...field.value,
                          manure: {
                            ...field.value?.manure,
                            rawManure: {
                              ...field.value?.manure?.rawManure,
                              plannedGrazing: e,
                              no: false,
                              yes: false,
                            },
                          },
                        })
                      }
                    />
                  </Field>
                </Field>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="compostWithManure">
                Compost with manure
              </FieldLabel>
              <Checkbox
                checked={field.value?.compostWithManure?.isCompostWithManure}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    compostWithManure: {
                      ...field.value?.compostWithManure,
                      isCompostWithManure: e,
                    },
                  })
                }
              />
              {field.value?.compostWithManure?.isCompostWithManure && (
                <Input
                  placeholder="Describe ingredients, what percentage is produced on the farm, are Biodynamic preparations used"
                  value={field.value?.compostWithManure?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      compostWithManure: {
                        ...field.value?.compostWithManure,
                        description: e.target.value,
                      },
                    })
                  }
                />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="compostWithoutManure">
                Compost without manure
              </FieldLabel>
              <Checkbox
                checked={
                  field.value?.compostWithoutManure?.isCompostWithoutManure
                }
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    compostWithoutManure: {
                      ...field.value?.compostWithoutManure,
                      isCompostWithoutManure: e,
                    },
                  })
                }
              />
              {field.value?.compostWithoutManure?.isCompostWithoutManure && (
                <Input
                  placeholder="Describe ingredients, what percentage is produced on the farm, are Biodynamic preparations used"
                  value={field.value?.compostWithoutManure?.description ?? ''}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      compostWithoutManure: {
                        ...field.value?.compostWithoutManure,
                        description: e.target.value,
                      },
                    })
                  }
                />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="incorporationOfCropResidue">
                Incorporation of crop residue
              </FieldLabel>
              <Checkbox
                checked={field.value?.incorporationOfCropResidue}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    incorporationOfCropResidue: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="minedGypsumOrLimestone">
                Mined gypsum or limestone
              </FieldLabel>
              <Checkbox
                checked={field.value?.minedGypsumOrLimestone}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    minedGypsumOrLimestone: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="foliarFertilizers">
                Foliar fertilizers
              </FieldLabel>
              <Checkbox
                checked={field.value?.foliarFertilizers}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    foliarFertilizers: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="cropRotation">Crop rotation</FieldLabel>
              <Checkbox
                checked={field.value?.cropRotation}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    cropRotation: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="blendedFertilizers">
                Blended fertilizers
              </FieldLabel>
              <Checkbox
                checked={field.value?.blendedFertilizers}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    blendedFertilizers: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="minedMineralsOrPowders">
                Mined minerals or powders
              </FieldLabel>
              <Checkbox
                checked={field.value?.minedMineralsOrPowders}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    minedMineralsOrPowders: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plantMaterials">Plant materials</FieldLabel>
              <Checkbox
                checked={field.value?.plantMaterials}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    plantMaterials: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="biodynamicPreparations">
                Biodynamic preparations
              </FieldLabel>
              <Checkbox
                checked={field.value?.biodynamicPreparations}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    biodynamicPreparations: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="soilInoculants">Soil inoculants</FieldLabel>
              <Checkbox
                checked={field.value?.soilInoculants}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    soilInoculants: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="coverCropsIncludingGreenManures">
                Cover crops including green manures
              </FieldLabel>
              <Checkbox
                checked={field.value?.coverCropsIncludingGreenManures}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    coverCropsIncludingGreenManures: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sideDressingOrDripApplications">
                Side dressing or drip applications
              </FieldLabel>
              <Checkbox
                checked={field.value?.sideDressingOrDripApplications}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    sideDressingOrDripApplications: e,
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="otherCultivationPractice">
                Other describe:
              </FieldLabel>
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
          </FieldSet>
        )}
      />
    </Field>
  );
}
