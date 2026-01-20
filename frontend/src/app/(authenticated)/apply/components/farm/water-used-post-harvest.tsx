// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function WaterUsedPostHarvest({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          Is water used in direct contact with produce post-harvest?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="waterUsedPostHarvest"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="waterUsedPostHarvest"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-4">
            {/* No */}
            <Field>
              <FieldLabel htmlFor="waterPostHarvestNo">No</FieldLabel>
              <Checkbox
                checked={field.value?.no}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    no: e,
                    yes: e ? { isYes: false } : field.value?.yes,
                  })
                }
              />
            </Field>

            {/* Yes */}
            <Field>
              <FieldLabel htmlFor="waterPostHarvestYes">Yes</FieldLabel>
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
                  {/* Safe Drinking Water Act Standards */}
                  <div>
                    <FieldLabel>
                      If you treat wash water on-site (e.g. RO, UV, carbon
                      filtration, water softeners, pH adjustment), does treated
                      water meet Safe Drinking Water Act Standards?
                    </FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="safeDrinkingWaterYes">
                          Yes
                        </FieldLabel>
                        <Checkbox
                          checked={field.value?.yes?.safeDrinkingWater?.yes}
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              yes: {
                                ...field.value?.yes,
                                safeDrinkingWater: {
                                  ...field.value?.yes?.safeDrinkingWater,
                                  yes: e,
                                  notApplicable: e
                                    ? false
                                    : field.value?.yes?.safeDrinkingWater
                                        ?.notApplicable,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="safeDrinkingWaterNA">
                          Not applicable
                        </FieldLabel>
                        <Checkbox
                          checked={
                            field.value?.yes?.safeDrinkingWater?.notApplicable
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              yes: {
                                ...field.value?.yes,
                                safeDrinkingWater: {
                                  ...field.value?.yes?.safeDrinkingWater,
                                  notApplicable: e,
                                  yes: e
                                    ? false
                                    : field.value?.yes?.safeDrinkingWater?.yes,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                    </FieldSet>
                  </div>

                  {/* Disinfectants */}
                  <div>
                    <FieldLabel>Are disinfectants used?</FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="disinfectantsNo">No</FieldLabel>
                        <Checkbox
                          checked={field.value?.yes?.disinfectants?.no}
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              yes: {
                                ...field.value?.yes,
                                disinfectants: {
                                  ...field.value?.yes?.disinfectants,
                                  no: e,
                                  yes: e
                                    ? { isYes: false }
                                    : field.value?.yes?.disinfectants?.yes,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="disinfectantsYes">Yes</FieldLabel>
                        <Checkbox
                          checked={field.value?.yes?.disinfectants?.yes?.isYes}
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              yes: {
                                ...field.value?.yes,
                                disinfectants: {
                                  ...field.value?.yes?.disinfectants,
                                  no: e
                                    ? false
                                    : field.value?.yes?.disinfectants?.no,
                                  yes: {
                                    ...field.value?.yes?.disinfectants?.yes,
                                    isYes: e,
                                  },
                                },
                              },
                            })
                          }
                        />
                        {field.value?.yes?.disinfectants?.yes?.isYes && (
                          <FieldSet className="ml-6 flex flex-col gap-2">
                            <Field>
                              <FieldLabel htmlFor="detergent">
                                Detergent, soap or cleaner
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.detergent
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          detergent: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="chlorine">
                                Chlorine (calcium hypochlorite, chlorine
                                dioxide, sodium hypochlorite, or hypochlorous
                                acid generated from electrolyzed water)
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes?.chlorine
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          chlorine: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="chlorineOther">
                                Chlorine, other:
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.chlorineOther?.isChlorineOther
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          chlorineOther: {
                                            ...field.value?.yes?.disinfectants
                                              ?.yes?.chlorineOther,
                                            isChlorineOther: e,
                                          },
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                              {field.value?.yes?.disinfectants?.yes
                                ?.chlorineOther?.isChlorineOther && (
                                <Input
                                  placeholder="Describe other chlorine type"
                                  value={
                                    field.value?.yes?.disinfectants?.yes
                                      ?.chlorineOther?.description ?? ''
                                  }
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      yes: {
                                        ...field.value?.yes,
                                        disinfectants: {
                                          ...field.value?.yes?.disinfectants,
                                          yes: {
                                            ...field.value?.yes?.disinfectants
                                              ?.yes,
                                            chlorineOther: {
                                              ...field.value?.yes?.disinfectants
                                                ?.yes?.chlorineOther,
                                              description: e.target.value,
                                            },
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                              )}
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="peraceticAcid">
                                Peracetic acid/peroxyacetic acid
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.peraceticAcid
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          peraceticAcid: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="phosphoricAcid">
                                Phosphoric acid
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.phosphoricAcid
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          phosphoricAcid: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="ethanolIsopropanol">
                                Ethanol or Isopropanol
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.ethanolIsopropanol
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          ethanolIsopropanol: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="citricAcid">
                                Citric acid
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.citricAcid
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          citricAcid: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="hydrogenPeroxide">
                                Hydrogen peroxide
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.hydrogenPeroxide
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          hydrogenPeroxide: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="ozone">Ozone</FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes?.ozone
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          ozone: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="quaternaryAmmonium">
                                Quaternary ammonium
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes
                                    ?.quaternaryAmmonium
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          quaternaryAmmonium: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="disinfectantOther">
                                Other, describe:
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.yes?.disinfectants?.yes?.other
                                    ?.isOther
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    yes: {
                                      ...field.value?.yes,
                                      disinfectants: {
                                        ...field.value?.yes?.disinfectants,
                                        yes: {
                                          ...field.value?.yes?.disinfectants
                                            ?.yes,
                                          other: {
                                            ...field.value?.yes?.disinfectants
                                              ?.yes?.other,
                                            isOther: e,
                                          },
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                              {field.value?.yes?.disinfectants?.yes?.other
                                ?.isOther && (
                                <Input
                                  placeholder="Describe other disinfectant"
                                  value={
                                    field.value?.yes?.disinfectants?.yes?.other
                                      ?.description ?? ''
                                  }
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      yes: {
                                        ...field.value?.yes,
                                        disinfectants: {
                                          ...field.value?.yes?.disinfectants,
                                          yes: {
                                            ...field.value?.yes?.disinfectants
                                              ?.yes,
                                            other: {
                                              ...field.value?.yes?.disinfectants
                                                ?.yes?.other,
                                              description: e.target.value,
                                            },
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                              )}
                            </Field>
                          </FieldSet>
                        )}
                      </Field>
                    </FieldSet>
                  </div>
                </FieldSet>
              )}
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
