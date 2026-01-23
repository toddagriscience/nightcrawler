// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
          <FieldSet className="flex flex-col gap-2">
            {/* No */}
            <Field orientation="horizontal">
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
              <FieldLabel
                htmlFor="waterPostHarvestNo"
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
              <FieldLabel
                htmlFor="waterPostHarvestYes"
                className="whitespace-nowrap"
              >
                Yes
              </FieldLabel>
            </Field>
            {field.value?.yes?.isYes && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                {/* Safe Drinking Water Act Standards */}
                <div>
                  <FieldLabel className="mb-4">
                    If you treat wash water on-site (e.g. RO, UV, carbon
                    filtration, water softeners, pH adjustment), does treated
                    water meet Safe Drinking Water Act Standards?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
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
                      <FieldLabel
                        htmlFor="safeDrinkingWaterYes"
                        className="whitespace-nowrap"
                      >
                        Yes
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
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
                      <FieldLabel
                        htmlFor="safeDrinkingWaterNA"
                        className="whitespace-nowrap"
                      >
                        Not applicable
                      </FieldLabel>
                    </Field>
                  </div>
                </div>

                {/* Disinfectants */}
                <div>
                  <FieldLabel className="mb-4">
                    Are disinfectants used?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
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
                      <FieldLabel
                        htmlFor="disinfectantsNo"
                        className="whitespace-nowrap"
                      >
                        No
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
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
                      <FieldLabel
                        htmlFor="disinfectantsYes"
                        className="whitespace-nowrap"
                      >
                        Yes
                      </FieldLabel>
                    </Field>
                    {field.value?.yes?.disinfectants?.yes?.isYes && (
                      <div className="mb-4 ml-6 flex flex-col gap-2">
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.yes?.disinfectants?.yes?.detergent
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                yes: {
                                  ...field.value?.yes,
                                  disinfectants: {
                                    ...field.value?.yes?.disinfectants,
                                    yes: {
                                      ...field.value?.yes?.disinfectants?.yes,
                                      detergent: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="detergent">
                            Detergent, soap or cleaner
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      chlorine: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="chlorine">
                            Chlorine (calcium hypochlorite, chlorine dioxide,
                            sodium hypochlorite, or hypochlorous acid generated
                            from electrolyzed water)
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      chlorineOther: {
                                        ...field.value?.yes?.disinfectants?.yes
                                          ?.chlorineOther,
                                        isChlorineOther: e,
                                      },
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="chlorineOther"
                            className="whitespace-nowrap"
                          >
                            Chlorine, other:
                          </FieldLabel>
                        </Field>
                        {field.value?.yes?.disinfectants?.yes?.chlorineOther
                          ?.isChlorineOther && (
                          <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                            <Textarea
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
                                        ...field.value?.yes?.disinfectants?.yes,
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
                          </div>
                        )}
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      peraceticAcid: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="peraceticAcid">
                            Peracetic acid/peroxyacetic acid
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      phosphoricAcid: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="phosphoricAcid">
                            Phosphoric acid
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      ethanolIsopropanol: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="ethanolIsopropanol">
                            Ethanol or Isopropanol
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.yes?.disinfectants?.yes?.citricAcid
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                yes: {
                                  ...field.value?.yes,
                                  disinfectants: {
                                    ...field.value?.yes?.disinfectants,
                                    yes: {
                                      ...field.value?.yes?.disinfectants?.yes,
                                      citricAcid: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="citricAcid">
                            Citric acid
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      hydrogenPeroxide: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="hydrogenPeroxide">
                            Hydrogen peroxide
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      ozone: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="ozone"
                            className="whitespace-nowrap"
                          >
                            Ozone
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      quaternaryAmmonium: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="quaternaryAmmonium">
                            Quaternary ammonium
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
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
                                      ...field.value?.yes?.disinfectants?.yes,
                                      other: {
                                        ...field.value?.yes?.disinfectants?.yes
                                          ?.other,
                                        isOther: e,
                                      },
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="disinfectantOther"
                            className="whitespace-nowrap"
                          >
                            Other, describe:
                          </FieldLabel>
                        </Field>
                        {field.value?.yes?.disinfectants?.yes?.other
                          ?.isOther && (
                          <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                            <Textarea
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
                                        ...field.value?.yes?.disinfectants?.yes,
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
                          </div>
                        )}
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
