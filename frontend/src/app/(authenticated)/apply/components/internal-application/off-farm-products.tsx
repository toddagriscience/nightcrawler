// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';

interface OffFarmProductsProps {
  control: Control<FarmInfoInternalApplicationInsert>;
  errors: FieldErrors<FarmInfoInternalApplicationInsert>;
}

export default function OffFarmProducts({
  control,
  errors,
}: OffFarmProductsProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>
          What, if any, off-farm products, including commercial compost, manure,
          gypsum, limestone, micronutrients, or other fertilizers/soil
          amendments.
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
          <FieldSet className="flex flex-col gap-4">
            {/* Manure verification checkbox */}
            <Field>
              <FieldLabel htmlFor="manureVerification">
                I have verified that any manure-based farm inputs, including
                compost and formulated products, do not contain manure that is
                sourced from intensive livestock operations/confinement
                operations.
              </FieldLabel>
              <Checkbox
                checked={field.value?.manureVerification}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    manureVerification: e,
                  })
                }
              />
            </Field>

            {/* Seeds checkbox with nested options */}
            <Field>
              <FieldLabel htmlFor="seeds">Seeds</FieldLabel>
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
              {field.value?.seeds?.isSeeds && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  {/* Organic certified */}
                  <Field>
                    <FieldLabel htmlFor="organicCertified">
                      Organic certified
                    </FieldLabel>
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
                  </Field>

                  {/* Biodynamic certified */}
                  <Field>
                    <FieldLabel htmlFor="biodynamicCertified">
                      Biodynamic certified
                    </FieldLabel>
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
                    {field.value?.seeds?.biodynamicCertified
                      ?.isBiodynamicCertified && (
                      <FieldSet className="ml-6 flex flex-col gap-2">
                        <FieldLabel>
                          How do you verify that the seed is not a product of
                          cytoplasm or protoplasm fusion production techniques?
                        </FieldLabel>
                        <Field>
                          <FieldLabel htmlFor="biodynamicNonCmsStatement">
                            Non-CMS statement from the supplier
                          </FieldLabel>
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
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="biodynamicOther">
                            Other, describe:
                          </FieldLabel>
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
                          {field.value?.seeds?.biodynamicCertified?.other
                            ?.isOther && (
                            <Input
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
                                      ...field.value?.seeds
                                        ?.biodynamicCertified,
                                      other: {
                                        ...field.value?.seeds
                                          ?.biodynamicCertified?.other,
                                        description: e.target.value,
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

                  {/* Organic, treated */}
                  <Field>
                    <FieldLabel htmlFor="organicTreated">
                      Organic, treated
                    </FieldLabel>
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
                    {field.value?.seeds?.organicTreated?.isOrganicTreated && (
                      <FieldSet className="ml-6 flex flex-col gap-2">
                        <FieldLabel>
                          How do you verify that the treatment uses only allowed
                          materials and is non-GMO?
                        </FieldLabel>
                        <Field>
                          <FieldLabel htmlFor="organicTreatedOmri">
                            OMRI or WSDA listing
                          </FieldLabel>
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
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="organicTreatedNop">
                            NOP approval
                          </FieldLabel>
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
                        </Field>
                      </FieldSet>
                    )}
                  </Field>

                  {/* Conventional */}
                  <Field>
                    <FieldLabel htmlFor="conventional">Conventional</FieldLabel>
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
                    {field.value?.seeds?.conventional?.isConventional && (
                      <FieldSet className="ml-6 flex flex-col gap-2">
                        <FieldLabel>
                          How do you document that conventional seeds are not
                          genetically modified?
                        </FieldLabel>
                        <Field>
                          <FieldLabel htmlFor="conventionalNonGmo">
                            Non-GMO statement from the supplier
                          </FieldLabel>
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
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="conventionalOther">
                            Other, describe:
                          </FieldLabel>
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
                                      ...field.value?.seeds?.conventional
                                        ?.other,
                                      isOther: e,
                                    },
                                  },
                                },
                              })
                            }
                          />
                          {field.value?.seeds?.conventional?.other?.isOther && (
                            <Input
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
                          )}
                        </Field>
                      </FieldSet>
                    )}
                  </Field>

                  {/* Conventional, treated */}
                  <Field>
                    <FieldLabel htmlFor="conventionalTreated">
                      Conventional, treated
                    </FieldLabel>
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
                    {field.value?.seeds?.conventionalTreated
                      ?.isConventionalTreated && (
                      <FieldSet className="ml-6 flex flex-col gap-4">
                        {/* Treatment verification */}
                        <div>
                          <FieldLabel>
                            How do you verify that the treatment uses only
                            allowed materials and is non-GMO?
                          </FieldLabel>
                          <FieldSet className="flex flex-col gap-2">
                            <Field>
                              <FieldLabel htmlFor="conventionalTreatedOmri">
                                OMRI or WSDA listing
                              </FieldLabel>
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
                                        ...field.value?.seeds
                                          ?.conventionalTreated,
                                        omriOrWsda: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="conventionalTreatedNop">
                                NOP approval
                              </FieldLabel>
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
                                        ...field.value?.seeds
                                          ?.conventionalTreated,
                                        nopApproval: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                          </FieldSet>
                        </div>

                        {/* GMO documentation */}
                        <div>
                          <FieldLabel>
                            How do you document that conventional seeds are not
                            genetically modified?
                          </FieldLabel>
                          <FieldSet className="flex flex-col gap-2">
                            <Field>
                              <FieldLabel htmlFor="conventionalTreatedNonGmo">
                                Non-GMO statement from the supplier
                              </FieldLabel>
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
                                        ...field.value?.seeds
                                          ?.conventionalTreated,
                                        nonGmoStatement: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="conventionalTreatedOther">
                                Other, describe:
                              </FieldLabel>
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
                                        ...field.value?.seeds
                                          ?.conventionalTreated,
                                        other: {
                                          ...field.value?.seeds
                                            ?.conventionalTreated?.other,
                                          isOther: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                              {field.value?.seeds?.conventionalTreated?.other
                                ?.isOther && (
                                <Input
                                  placeholder="Describe other documentation method"
                                  value={
                                    field.value?.seeds?.conventionalTreated
                                      ?.other?.description ?? ''
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
                              )}
                            </Field>
                          </FieldSet>
                        </div>
                      </FieldSet>
                    )}
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Transplants/planting stock checkbox with nested options */}
            <Field>
              <FieldLabel htmlFor="transplants">
                Transplants/planting stock
              </FieldLabel>
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
              {field.value?.transplants?.isTransplants && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  {/* Organic certified */}
                  <Field>
                    <FieldLabel htmlFor="transplantsOrganicCertified">
                      Organic certified
                    </FieldLabel>
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
                  </Field>

                  {/* Biodynamic certified */}
                  <Field>
                    <FieldLabel htmlFor="transplantsBiodynamicCertified">
                      Biodynamic certified
                    </FieldLabel>
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
                  </Field>

                  {/* Conventional */}
                  <Field>
                    <FieldLabel htmlFor="transplantsConventional">
                      Conventional
                    </FieldLabel>
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
                    {field.value?.transplants?.conventional?.isConventional && (
                      <FieldSet className="ml-6 flex flex-col gap-4">
                        {/* Organic management verification */}
                        <div>
                          <FieldLabel>
                            For conventional planting stock to produce an
                            organic crop, how you ensure that new vegetative,
                            flowering, and fruiting growth occurs under organic
                            management prior to the first harvest.
                          </FieldLabel>
                          <FieldSet className="flex flex-col gap-2">
                            <Field>
                              <FieldLabel htmlFor="transplantsNoCropHarvested">
                                No crop harvested for organic sale during the
                                first season or crop year
                              </FieldLabel>
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
                                        ...field.value?.transplants
                                          ?.conventional,
                                        noCropHarvested: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="transplantsPruning">
                                Pruning/removal of non-organic plant material
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.transplants?.conventional
                                    ?.pruning
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    transplants: {
                                      ...field.value?.transplants,
                                      conventional: {
                                        ...field.value?.transplants
                                          ?.conventional,
                                        pruning: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="transplantsHarvestNonOrganic">
                                Harvest and sell as non-organic
                              </FieldLabel>
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
                                        ...field.value?.transplants
                                          ?.conventional,
                                        harvestNonOrganic: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="transplantsManagementOther">
                                Other, describe
                              </FieldLabel>
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
                                        ...field.value?.transplants
                                          ?.conventional,
                                        managementOther: {
                                          ...field.value?.transplants
                                            ?.conventional?.managementOther,
                                          isOther: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                              {field.value?.transplants?.conventional
                                ?.managementOther?.isOther && (
                                <Input
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
                                          ...field.value?.transplants
                                            ?.conventional,
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
                              )}
                            </Field>
                          </FieldSet>
                        </div>

                        {/* GMO documentation */}
                        <div>
                          <FieldLabel>
                            How do you document that conventional
                            transplants/stock is not genetically modified?
                          </FieldLabel>
                          <FieldSet className="flex flex-col gap-2">
                            <Field>
                              <FieldLabel htmlFor="transplantsNonGmoStatement">
                                Non-GMO statement from the supplier
                              </FieldLabel>
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
                                        ...field.value?.transplants
                                          ?.conventional,
                                        nonGmoStatement: e,
                                      },
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="transplantsGmoOther">
                                Other, describe:
                              </FieldLabel>
                              <Checkbox
                                checked={
                                  field.value?.transplants?.conventional
                                    ?.gmoOther?.isOther
                                }
                                onCheckedChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    transplants: {
                                      ...field.value?.transplants,
                                      conventional: {
                                        ...field.value?.transplants
                                          ?.conventional,
                                        gmoOther: {
                                          ...field.value?.transplants
                                            ?.conventional?.gmoOther,
                                          isOther: e,
                                        },
                                      },
                                    },
                                  })
                                }
                              />
                              {field.value?.transplants?.conventional?.gmoOther
                                ?.isOther && (
                                <Input
                                  placeholder="Describe other documentation method"
                                  value={
                                    field.value?.transplants?.conventional
                                      ?.gmoOther?.description ?? ''
                                  }
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      transplants: {
                                        ...field.value?.transplants,
                                        conventional: {
                                          ...field.value?.transplants
                                            ?.conventional,
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
                              )}
                            </Field>
                          </FieldSet>
                        </div>
                      </FieldSet>
                    )}
                  </Field>
                </FieldSet>
              )}
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
