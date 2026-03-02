// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function CultivationPractices() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
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
          <FieldSet className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.manure?.isManure}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    manure: { ...field.value?.manure, isManure: e },
                  })
                }
              />
              <FieldLabel htmlFor="manure" className="whitespace-nowrap">
                Manure
              </FieldLabel>
            </Field>
            {field.value?.manure?.isManure && (
              <div className="mb-4 ml-6">
                <FieldLabel className="mb-4">
                  Do you apply raw animal manure (including any compost, compost
                  tea, or vermicompost containing manure is not composted),
                  and/or do you have planned grazing of animals in your organic
                  crop production areas?
                </FieldLabel>
                <div className="flex flex-col gap-2">
                  <Field orientation="horizontal">
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
                    <FieldLabel
                      htmlFor="manureNo"
                      className="whitespace-nowrap"
                    >
                      No
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
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
                    <FieldLabel
                      htmlFor="manureYes"
                      className="whitespace-nowrap"
                    >
                      Yes
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
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
                    <FieldLabel htmlFor="manurePlannedGrazing">
                      Yes, my operation uses planned grazing of animals in
                      organic crop production areas
                    </FieldLabel>
                  </Field>
                </div>
              </div>
            )}
            <Field orientation="horizontal">
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
              <FieldLabel
                htmlFor="compostWithManure"
                className="whitespace-nowrap"
              >
                Compost with manure
              </FieldLabel>
            </Field>
            {field.value?.compostWithManure?.isCompostWithManure && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
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
              </div>
            )}
            <Field orientation="horizontal">
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
              <FieldLabel
                htmlFor="compostWithoutManure"
                className="whitespace-nowrap"
              >
                Compost without manure
              </FieldLabel>
            </Field>
            {field.value?.compostWithoutManure?.isCompostWithoutManure && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
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
              </div>
            )}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.incorporationOfCropResidue}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    incorporationOfCropResidue: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="incorporationOfCropResidue"
                className="whitespace-nowrap"
              >
                Incorporation of crop residue
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.minedGypsumOrLimestone}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    minedGypsumOrLimestone: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="minedGypsumOrLimestone"
                className="whitespace-nowrap"
              >
                Mined gypsum or limestone
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.foliarFertilizers}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    foliarFertilizers: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="foliarFertilizers"
                className="whitespace-nowrap"
              >
                Foliar fertilizers
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.cropRotation}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    cropRotation: e,
                  })
                }
              />
              <FieldLabel htmlFor="cropRotation" className="whitespace-nowrap">
                Crop rotation
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.blendedFertilizers}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    blendedFertilizers: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="blendedFertilizers"
                className="whitespace-nowrap"
              >
                Blended fertilizers
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.minedMineralsOrPowders}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    minedMineralsOrPowders: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="minedMineralsOrPowders"
                className="whitespace-nowrap"
              >
                Mined minerals or powders
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.plantMaterials}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    plantMaterials: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="plantMaterials"
                className="whitespace-nowrap"
              >
                Plant materials
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.biodynamicPreparations}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    biodynamicPreparations: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="biodynamicPreparations"
                className="whitespace-nowrap"
              >
                Biodynamic preparations
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.soilInoculants}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    soilInoculants: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="soilInoculants"
                className="whitespace-nowrap"
              >
                Soil inoculants
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.coverCropsIncludingGreenManures}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    coverCropsIncludingGreenManures: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="coverCropsIncludingGreenManures"
                className="whitespace-nowrap"
              >
                Cover crops including green manures
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.sideDressingOrDripApplications}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    sideDressingOrDripApplications: e,
                  })
                }
              />
              <FieldLabel
                htmlFor="sideDressingOrDripApplications"
                className="whitespace-nowrap"
              >
                Side dressing or drip applications
              </FieldLabel>
            </Field>
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
              <FieldLabel
                htmlFor="otherCultivationPractice"
                className="whitespace-nowrap"
              >
                Other, describe:
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
          </FieldSet>
        )}
      />
    </Field>
  );
}
