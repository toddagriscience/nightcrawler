// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, useFormContext } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

export default function OffFarmProducts() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FarmInfoInternalApplicationInsert>();
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          What, if any, off-farm products, including commercial compost, manure,
          gypsum, limestone, micronutrients, or other fertilizers/soil
          amendments are used?
        </FieldLabel>
        <ErrorMessage
          errors={errors}
          name="offFarmProducts"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="offFarmProducts"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-2">
            {/* Manure verification checkbox */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.manureVerification}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    manureVerification: e,
                  })
                }
              />
              <FieldLabel htmlFor="manureVerification">
                I have verified that any manure-based farm inputs, including
                compost and formulated products, do not contain manure that is
                sourced from intensive livestock operations/confinement
                operations.
              </FieldLabel>
            </Field>

            {/* Seeds checkbox with nested options */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.seeds?.isSeeds}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    seeds: {
                      ...field.value?.seeds,
                      isSeeds: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="seeds" className="whitespace-nowrap">
                Seeds
              </FieldLabel>
            </Field>
            {field.value?.seeds?.isSeeds && (
              <FieldSet className="ml-6 flex flex-col gap-2">
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.seeds?.organicCertified}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        seeds: {
                          ...field.value?.seeds,
                          organicCertified: e,
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="organicCertified"
                    className="whitespace-nowrap"
                  >
                    Organic certified
                  </FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Checkbox
                    checked={
                      field.value?.seeds?.biodynamicCertified
                        ?.isBiodynamicCertified
                    }
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        seeds: {
                          ...field.value?.seeds,
                          biodynamicCertified: {
                            ...field.value?.seeds?.biodynamicCertified,
                            isBiodynamicCertified: e,
                          },
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="biodynamicCertified"
                    className="whitespace-nowrap"
                  >
                    Biodynamic certified
                  </FieldLabel>
                </Field>
                {field.value?.seeds?.biodynamicCertified
                  ?.isBiodynamicCertified && (
                  <div className="mb-4 ml-6">
                    <FieldLabel className="mb-4">
                      How do you verify that the seed is not a product of
                      cytoplasm or protoplasm fusion production techniques?
                    </FieldLabel>
                    <div className="flex flex-col gap-2">
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={
                            field.value?.seeds?.biodynamicCertified
                              ?.nonCmsStatement
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              seeds: {
                                ...field.value?.seeds,
                                biodynamicCertified: {
                                  ...field.value?.seeds?.biodynamicCertified,
                                  nonCmsStatement: e,
                                },
                              },
                            })
                          }
                        />
                        <FieldLabel htmlFor="biodynamicNonCmsStatement">
                          Non-CMS statement from the supplier
                        </FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={
                            field.value?.seeds?.biodynamicCertified?.other
                              ?.isOther
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              seeds: {
                                ...field.value?.seeds,
                                biodynamicCertified: {
                                  ...field.value?.seeds?.biodynamicCertified,
                                  other: {
                                    ...field.value?.seeds?.biodynamicCertified
                                      ?.other,
                                    isOther: e,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <FieldLabel
                          htmlFor="biodynamicOther"
                          className="whitespace-nowrap"
                        >
                          Other, describe:
                        </FieldLabel>
                      </Field>
                      {field.value?.seeds?.biodynamicCertified?.other
                        ?.isOther && (
                        <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                          <Textarea
                            placeholder="Describe other verification method"
                            value={
                              field.value?.seeds?.biodynamicCertified?.other
                                ?.description ?? ''
                            }
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                seeds: {
                                  ...field.value?.seeds,
                                  biodynamicCertified: {
                                    ...field.value?.seeds?.biodynamicCertified,
                                    other: {
                                      ...field.value?.seeds?.biodynamicCertified
                                        ?.other,
                                      description: e.target.value,
                                    },
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Field orientation="horizontal">
                  <Checkbox
                    checked={
                      field.value?.seeds?.organicTreated?.isOrganicTreated
                    }
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        seeds: {
                          ...field.value?.seeds,
                          organicTreated: {
                            ...field.value?.seeds?.organicTreated,
                            isOrganicTreated: e,
                          },
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="organicTreated"
                    className="whitespace-nowrap"
                  >
                    Organic, treated
                  </FieldLabel>
                </Field>
                {field.value?.seeds?.organicTreated?.isOrganicTreated && (
                  <div className="mb-4 ml-6">
                    <FieldLabel className="mb-4">
                      How do you verify that the treatment uses only allowed
                      materials and is non-GMO?
                    </FieldLabel>
                    <div className="flex flex-col gap-2">
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={
                            field.value?.seeds?.organicTreated?.omriOrWsda
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              seeds: {
                                ...field.value?.seeds,
                                organicTreated: {
                                  ...field.value?.seeds?.organicTreated,
                                  omriOrWsda: e,
                                },
                              },
                            })
                          }
                        />
                        <FieldLabel
                          htmlFor="organicTreatedOmri"
                          className="whitespace-nowrap"
                        >
                          OMRI or WSDA listing
                        </FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={
                            field.value?.seeds?.organicTreated?.nopApproval
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              seeds: {
                                ...field.value?.seeds,
                                organicTreated: {
                                  ...field.value?.seeds?.organicTreated,
                                  nopApproval: e,
                                },
                              },
                            })
                          }
                        />
                        <FieldLabel
                          htmlFor="organicTreatedNop"
                          className="whitespace-nowrap"
                        >
                          NOP approval
                        </FieldLabel>
                      </Field>
                    </div>
                  </div>
                )}

                {/* Conventional */}
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.seeds?.conventional?.isConventional}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        seeds: {
                          ...field.value?.seeds,
                          conventional: {
                            ...field.value?.seeds?.conventional,
                            isConventional: e,
                          },
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="conventional"
                    className="whitespace-nowrap"
                  >
                    Conventional
                  </FieldLabel>
                </Field>
                {field.value?.seeds?.conventional?.isConventional && (
                  <div className="mb-4 ml-6">
                    <FieldLabel className="mb-4">
                      How do you document that conventional seeds are not
                      genetically modified?
                    </FieldLabel>
                    <div className="flex flex-col gap-2">
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={
                            field.value?.seeds?.conventional?.nonGmoStatement
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              seeds: {
                                ...field.value?.seeds,
                                conventional: {
                                  ...field.value?.seeds?.conventional,
                                  nonGmoStatement: e,
                                },
                              },
                            })
                          }
                        />
                        <FieldLabel htmlFor="conventionalNonGmo">
                          Non-GMO statement from the supplier
                        </FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={
                            field.value?.seeds?.conventional?.other?.isOther
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              seeds: {
                                ...field.value?.seeds,
                                conventional: {
                                  ...field.value?.seeds?.conventional,
                                  other: {
                                    ...field.value?.seeds?.conventional?.other,
                                    isOther: e,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <FieldLabel
                          htmlFor="conventionalOther"
                          className="whitespace-nowrap"
                        >
                          Other, describe:
                        </FieldLabel>
                      </Field>
                      {field.value?.seeds?.conventional?.other?.isOther && (
                        <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                          <Textarea
                            placeholder="Describe other documentation method"
                            value={
                              field.value?.seeds?.conventional?.other
                                ?.description ?? ''
                            }
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                seeds: {
                                  ...field.value?.seeds,
                                  conventional: {
                                    ...field.value?.seeds?.conventional,
                                    other: {
                                      ...field.value?.seeds?.conventional
                                        ?.other,
                                      description: e.target.value,
                                    },
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Conventional, treated */}
                <Field orientation="horizontal">
                  <Checkbox
                    checked={
                      field.value?.seeds?.conventionalTreated
                        ?.isConventionalTreated
                    }
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        seeds: {
                          ...field.value?.seeds,
                          conventionalTreated: {
                            ...field.value?.seeds?.conventionalTreated,
                            isConventionalTreated: e,
                          },
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="conventionalTreated"
                    className="whitespace-nowrap"
                  >
                    Conventional, treated
                  </FieldLabel>
                </Field>
                {field.value?.seeds?.conventionalTreated
                  ?.isConventionalTreated && (
                  <div className="mb-4 ml-6 flex flex-col gap-4">
                    {/* Treatment verification */}
                    <div>
                      <FieldLabel className="mb-4">
                        How do you verify that the treatment uses only allowed
                        materials and is non-GMO?
                      </FieldLabel>
                      <div className="flex flex-col gap-2">
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.seeds?.conventionalTreated
                                ?.omriOrWsda
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                seeds: {
                                  ...field.value?.seeds,
                                  conventionalTreated: {
                                    ...field.value?.seeds?.conventionalTreated,
                                    omriOrWsda: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="conventionalTreatedOmri"
                            className="whitespace-nowrap"
                          >
                            OMRI or WSDA listing
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.seeds?.conventionalTreated
                                ?.nopApproval
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                seeds: {
                                  ...field.value?.seeds,
                                  conventionalTreated: {
                                    ...field.value?.seeds?.conventionalTreated,
                                    nopApproval: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="conventionalTreatedNop"
                            className="whitespace-nowrap"
                          >
                            NOP approval
                          </FieldLabel>
                        </Field>
                      </div>
                    </div>

                    {/* GMO documentation */}
                    <div>
                      <FieldLabel className="mb-4">
                        How do you document that conventional seeds are not
                        genetically modified?
                      </FieldLabel>
                      <div className="flex flex-col gap-2">
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.seeds?.conventionalTreated
                                ?.nonGmoStatement
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                seeds: {
                                  ...field.value?.seeds,
                                  conventionalTreated: {
                                    ...field.value?.seeds?.conventionalTreated,
                                    nonGmoStatement: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="conventionalTreatedNonGmo">
                            Non-GMO statement from the supplier
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.seeds?.conventionalTreated?.other
                                ?.isOther
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                seeds: {
                                  ...field.value?.seeds,
                                  conventionalTreated: {
                                    ...field.value?.seeds?.conventionalTreated,
                                    other: {
                                      ...field.value?.seeds?.conventionalTreated
                                        ?.other,
                                      isOther: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="conventionalTreatedOther"
                            className="whitespace-nowrap"
                          >
                            Other, describe:
                          </FieldLabel>
                        </Field>
                        {field.value?.seeds?.conventionalTreated?.other
                          ?.isOther && (
                          <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                            <Textarea
                              placeholder="Describe other documentation method"
                              value={
                                field.value?.seeds?.conventionalTreated?.other
                                  ?.description ?? ''
                              }
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  seeds: {
                                    ...field.value?.seeds,
                                    conventionalTreated: {
                                      ...field.value?.seeds
                                        ?.conventionalTreated,
                                      other: {
                                        ...field.value?.seeds
                                          ?.conventionalTreated?.other,
                                        description: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </FieldSet>
            )}

            {/* Transplants/planting stock checkbox with nested options */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.transplants?.isTransplants}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    transplants: {
                      ...field.value?.transplants,
                      isTransplants: e,
                    },
                  })
                }
              />
              <FieldLabel htmlFor="transplants">
                Transplants/planting stock
              </FieldLabel>
            </Field>
            {field.value?.transplants?.isTransplants && (
              <FieldSet className="ml-6 flex flex-col gap-2">
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.transplants?.organicCertified}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        transplants: {
                          ...field.value?.transplants,
                          organicCertified: e,
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="transplantsOrganicCertified"
                    className="whitespace-nowrap"
                  >
                    Organic certified
                  </FieldLabel>
                </Field>

                {/* Biodynamic certified */}
                <Field orientation="horizontal">
                  <Checkbox
                    checked={field.value?.transplants?.biodynamicCertified}
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        transplants: {
                          ...field.value?.transplants,
                          biodynamicCertified: e,
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="transplantsBiodynamicCertified"
                    className="whitespace-nowrap"
                  >
                    Biodynamic certified
                  </FieldLabel>
                </Field>

                {/* Conventional */}
                <Field orientation="horizontal">
                  <Checkbox
                    checked={
                      field.value?.transplants?.conventional?.isConventional
                    }
                    onCheckedChange={(e) =>
                      field.onChange({
                        ...field.value,
                        transplants: {
                          ...field.value?.transplants,
                          conventional: {
                            ...field.value?.transplants?.conventional,
                            isConventional: e,
                          },
                        },
                      })
                    }
                  />
                  <FieldLabel
                    htmlFor="transplantsConventional"
                    className="whitespace-nowrap"
                  >
                    Conventional
                  </FieldLabel>
                </Field>
                {field.value?.transplants?.conventional?.isConventional && (
                  <div className="mb-4 ml-6 flex flex-col gap-4">
                    {/* Organic management verification */}
                    <div>
                      <FieldLabel className="mb-4">
                        For conventional planting stock to produce an organic
                        crop, how you ensure that new vegetative, flowering, and
                        fruiting growth occurs under organic management prior to
                        the first harvest.
                      </FieldLabel>
                      <div className="flex flex-col gap-2">
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.transplants?.conventional
                                ?.noCropHarvested
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                transplants: {
                                  ...field.value?.transplants,
                                  conventional: {
                                    ...field.value?.transplants?.conventional,
                                    noCropHarvested: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="transplantsNoCropHarvested">
                            No crop harvested for organic sale during the first
                            season or crop year
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.transplants?.conventional?.pruning
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                transplants: {
                                  ...field.value?.transplants,
                                  conventional: {
                                    ...field.value?.transplants?.conventional,
                                    pruning: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="transplantsPruning">
                            Pruning/removal of non-organic plant material
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.transplants?.conventional
                                ?.harvestNonOrganic
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                transplants: {
                                  ...field.value?.transplants,
                                  conventional: {
                                    ...field.value?.transplants?.conventional,
                                    harvestNonOrganic: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="transplantsHarvestNonOrganic">
                            Harvest and sell as non-organic
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.transplants?.conventional
                                ?.managementOther?.isOther
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                transplants: {
                                  ...field.value?.transplants,
                                  conventional: {
                                    ...field.value?.transplants?.conventional,
                                    managementOther: {
                                      ...field.value?.transplants?.conventional
                                        ?.managementOther,
                                      isOther: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="transplantsManagementOther"
                            className="whitespace-nowrap"
                          >
                            Other, describe:
                          </FieldLabel>
                        </Field>
                        {field.value?.transplants?.conventional?.managementOther
                          ?.isOther && (
                          <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                            <Textarea
                              placeholder="Describe other method"
                              value={
                                field.value?.transplants?.conventional
                                  ?.managementOther?.description ?? ''
                              }
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  transplants: {
                                    ...field.value?.transplants,
                                    conventional: {
                                      ...field.value?.transplants?.conventional,
                                      managementOther: {
                                        ...field.value?.transplants
                                          ?.conventional?.managementOther,
                                        description: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* GMO documentation */}
                    <div>
                      <FieldLabel className="mb-4">
                        How do you document that conventional transplants/stock
                        is not genetically modified?
                      </FieldLabel>
                      <div className="flex flex-col gap-2">
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.transplants?.conventional
                                ?.nonGmoStatement
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                transplants: {
                                  ...field.value?.transplants,
                                  conventional: {
                                    ...field.value?.transplants?.conventional,
                                    nonGmoStatement: e,
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel htmlFor="transplantsNonGmoStatement">
                            Non-GMO statement from the supplier
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={
                              field.value?.transplants?.conventional?.gmoOther
                                ?.isOther
                            }
                            onCheckedChange={(e) =>
                              field.onChange({
                                ...field.value,
                                transplants: {
                                  ...field.value?.transplants,
                                  conventional: {
                                    ...field.value?.transplants?.conventional,
                                    gmoOther: {
                                      ...field.value?.transplants?.conventional
                                        ?.gmoOther,
                                      isOther: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          <FieldLabel
                            htmlFor="transplantsGmoOther"
                            className="whitespace-nowrap"
                          >
                            Other, describe:
                          </FieldLabel>
                        </Field>
                        {field.value?.transplants?.conventional?.gmoOther
                          ?.isOther && (
                          <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                            <Textarea
                              placeholder="Describe other documentation method"
                              value={
                                field.value?.transplants?.conventional?.gmoOther
                                  ?.description ?? ''
                              }
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  transplants: {
                                    ...field.value?.transplants,
                                    conventional: {
                                      ...field.value?.transplants?.conventional,
                                      gmoOther: {
                                        ...field.value?.transplants
                                          ?.conventional?.gmoOther,
                                        description: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </FieldSet>
            )}
          </FieldSet>
        )}
      />
    </Field>
  );
}
