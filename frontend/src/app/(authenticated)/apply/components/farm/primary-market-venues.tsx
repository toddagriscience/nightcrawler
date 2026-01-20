// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { Controller } from 'react-hook-form';
import { FarmFormControlProps } from '../../types';

export default function PrimaryMarketVenues({
  control,
  errors,
}: FarmFormControlProps) {
  return (
    <Field>
      <div className="flex flex-row justify-between">
        <FieldLabel>What are your primary market venues:</FieldLabel>
        <ErrorMessage
          errors={errors}
          name="primaryMarketVenues"
          render={({ message }) => <FormErrorMessage errorMessage={message} />}
        />
      </div>
      <Controller
        control={control}
        name="primaryMarketVenues"
        render={({ field }) => (
          <FieldSet className="flex flex-col gap-4">
            {/* Community Supported Agriculture (CSA) */}
            <Field>
              <FieldLabel htmlFor="csa">
                Community Supported Agriculture (CSA)
              </FieldLabel>
              <Checkbox
                checked={field.value?.csa}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    csa: e,
                  })
                }
              />
            </Field>

            {/* Copacking Services */}
            <Field>
              <FieldLabel htmlFor="copackingServices">
                Copacking Services
              </FieldLabel>
              <Checkbox
                checked={field.value?.copackingServices?.isCopackingServices}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    copackingServices: {
                      ...field.value?.copackingServices,
                      isCopackingServices: e,
                    },
                  })
                }
              />
              {field.value?.copackingServices?.isCopackingServices && (
                <FieldSet className="ml-6 flex flex-col gap-2">
                  <Field>
                    <FieldLabel htmlFor="copackingAddress">
                      Address of Post-Harvest Handling
                    </FieldLabel>
                    <Input
                      placeholder="Enter address"
                      value={field.value?.copackingServices?.address ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          copackingServices: {
                            ...field.value?.copackingServices,
                            address: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Export */}
            <Field>
              <FieldLabel htmlFor="export">Export</FieldLabel>
              <Checkbox
                checked={field.value?.export?.isExport}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    export: {
                      ...field.value?.export,
                      isExport: e,
                    },
                  })
                }
              />
              {field.value?.export?.isExport && (
                <FieldSet className="ml-6 flex flex-col gap-4">
                  {/* Foreign markets */}
                  <div>
                    <FieldLabel>
                      Which foreign markets do you export to, directly or
                      indirectly (including as by-products or through
                      brokers/traders, etc.)?
                    </FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="exportCanadaEu">
                          We export to Canada, the EU, UK, Japan, Korea,
                          Switzerland or Taiwan
                        </FieldLabel>
                        <Checkbox
                          checked={
                            field.value?.export?.foreignMarkets?.canadaEu
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              export: {
                                ...field.value?.export,
                                foreignMarkets: {
                                  ...field.value?.export?.foreignMarkets,
                                  canadaEu: e,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="exportMexico">
                          We export to Mexico
                        </FieldLabel>
                        <Checkbox
                          checked={field.value?.export?.foreignMarkets?.mexico}
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              export: {
                                ...field.value?.export,
                                foreignMarkets: {
                                  ...field.value?.export?.foreignMarkets,
                                  mexico: e,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="exportOther">
                          Other, describe:
                        </FieldLabel>
                        <Checkbox
                          checked={
                            field.value?.export?.foreignMarkets?.other?.isOther
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              export: {
                                ...field.value?.export,
                                foreignMarkets: {
                                  ...field.value?.export?.foreignMarkets,
                                  other: {
                                    ...field.value?.export?.foreignMarkets
                                      ?.other,
                                    isOther: e,
                                  },
                                },
                              },
                            })
                          }
                        />
                        {field.value?.export?.foreignMarkets?.other
                          ?.isOther && (
                          <Input
                            placeholder="Describe other markets"
                            value={
                              field.value?.export?.foreignMarkets?.other
                                ?.description ?? ''
                            }
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                export: {
                                  ...field.value?.export,
                                  foreignMarkets: {
                                    ...field.value?.export?.foreignMarkets,
                                    other: {
                                      ...field.value?.export?.foreignMarkets
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
                  </div>

                  {/* Final processing/packaging */}
                  <div>
                    <FieldLabel>
                      Does final processing/packaging occur in the US?
                    </FieldLabel>
                    <FieldSet className="flex flex-col gap-2">
                      <Field>
                        <FieldLabel htmlFor="processingYes">
                          Yes, I plan to export products produced, processed or
                          packaged in the US.
                        </FieldLabel>
                        <Checkbox
                          checked={field.value?.export?.finalProcessing?.yes}
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              export: {
                                ...field.value?.export,
                                finalProcessing: {
                                  ...field.value?.export?.finalProcessing,
                                  yes: e,
                                  some: e
                                    ? { isSome: false, description: '' }
                                    : field.value?.export?.finalProcessing
                                        ?.some,
                                  no: e
                                    ? false
                                    : field.value?.export?.finalProcessing?.no,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="processingSome">
                          Some products I plan to export are produced, processed
                          or packaged outside the US.
                        </FieldLabel>
                        <Checkbox
                          checked={
                            field.value?.export?.finalProcessing?.some?.isSome
                          }
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              export: {
                                ...field.value?.export,
                                finalProcessing: {
                                  ...field.value?.export?.finalProcessing,
                                  some: {
                                    ...field.value?.export?.finalProcessing
                                      ?.some,
                                    isSome: e,
                                  },
                                  yes: e
                                    ? false
                                    : field.value?.export?.finalProcessing?.yes,
                                  no: e
                                    ? false
                                    : field.value?.export?.finalProcessing?.no,
                                },
                              },
                            })
                          }
                        />
                        {field.value?.export?.finalProcessing?.some?.isSome && (
                          <Input
                            placeholder="Describe"
                            value={
                              field.value?.export?.finalProcessing?.some
                                ?.description ?? ''
                            }
                            onChange={(e) =>
                              field.onChange({
                                ...field.value,
                                export: {
                                  ...field.value?.export,
                                  finalProcessing: {
                                    ...field.value?.export?.finalProcessing,
                                    some: {
                                      ...field.value?.export?.finalProcessing
                                        ?.some,
                                      description: e.target.value,
                                    },
                                  },
                                },
                              })
                            }
                          />
                        )}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="processingNo">No</FieldLabel>
                        <Checkbox
                          checked={field.value?.export?.finalProcessing?.no}
                          onCheckedChange={(e) =>
                            field.onChange({
                              ...field.value,
                              export: {
                                ...field.value?.export,
                                finalProcessing: {
                                  ...field.value?.export?.finalProcessing,
                                  no: e,
                                  yes: e
                                    ? false
                                    : field.value?.export?.finalProcessing?.yes,
                                  some: e
                                    ? { isSome: false, description: '' }
                                    : field.value?.export?.finalProcessing
                                        ?.some,
                                },
                              },
                            })
                          }
                        />
                      </Field>
                    </FieldSet>
                  </div>

                  {/* Prevent non-compliant export */}
                  <Field>
                    <FieldLabel htmlFor="preventNonCompliant">
                      How do you prevent export of products that are not
                      compliant for the destination market? Describe:
                    </FieldLabel>
                    <Input
                      placeholder="Describe prevention measures"
                      value={field.value?.export?.preventNonCompliant ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          export: {
                            ...field.value?.export,
                            preventNonCompliant: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Farmer's Market */}
            <Field>
              <FieldLabel htmlFor="farmersMarket">
                Farmer&apos;s Market
              </FieldLabel>
              <Checkbox
                checked={field.value?.farmersMarket?.isFarmersMarket}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    farmersMarket: {
                      ...field.value?.farmersMarket,
                      isFarmersMarket: e,
                    },
                  })
                }
              />
              {field.value?.farmersMarket?.isFarmersMarket && (
                <FieldSet className="ml-6 flex flex-col gap-2">
                  <Field>
                    <FieldLabel htmlFor="farmersMarketName">Name:</FieldLabel>
                    <Input
                      placeholder="Enter market name"
                      value={field.value?.farmersMarket?.name ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          farmersMarket: {
                            ...field.value?.farmersMarket,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="farmersMarketAddress">
                      Address:
                    </FieldLabel>
                    <Input
                      placeholder="Enter address"
                      value={field.value?.farmersMarket?.address ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          farmersMarket: {
                            ...field.value?.farmersMarket,
                            address: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="sellsNonOrganic">
                      Do they sell non-organic produce
                    </FieldLabel>
                    <Checkbox
                      checked={field.value?.farmersMarket?.sellsNonOrganic}
                      onCheckedChange={(e) =>
                        field.onChange({
                          ...field.value,
                          farmersMarket: {
                            ...field.value?.farmersMarket,
                            sellsNonOrganic: e,
                          },
                        })
                      }
                    />
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Ingredients */}
            <Field>
              <FieldLabel htmlFor="ingredients">Ingredients</FieldLabel>
              <Checkbox
                checked={field.value?.ingredients}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    ingredients: e,
                  })
                }
              />
            </Field>

            {/* Website */}
            <Field>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Checkbox
                checked={field.value?.website?.isWebsite}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    website: {
                      ...field.value?.website,
                      isWebsite: e,
                    },
                  })
                }
              />
              {field.value?.website?.isWebsite && (
                <FieldSet className="ml-6 flex flex-col gap-2">
                  <Field>
                    <FieldLabel htmlFor="websiteDomain">Domain</FieldLabel>
                    <Input
                      placeholder="Enter website domain"
                      value={field.value?.website?.domain ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          website: {
                            ...field.value?.website,
                            domain: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Produce Stand */}
            <Field>
              <FieldLabel htmlFor="produceStand">Produce Stand</FieldLabel>
              <Checkbox
                checked={field.value?.produceStand}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    produceStand: e,
                  })
                }
              />
            </Field>

            {/* Retail */}
            <Field>
              <FieldLabel htmlFor="retail">Retail</FieldLabel>
              <Checkbox
                checked={field.value?.retail?.isRetail}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    retail: {
                      ...field.value?.retail,
                      isRetail: e,
                    },
                  })
                }
              />
              {field.value?.retail?.isRetail && (
                <FieldSet className="ml-6 flex flex-col gap-2">
                  <Field>
                    <FieldLabel htmlFor="retailNameLocation">
                      Name and location of retailers
                    </FieldLabel>
                    <Input
                      placeholder="Enter retailer name and location"
                      value={field.value?.retail?.nameAndLocation ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          retail: {
                            ...field.value?.retail,
                            nameAndLocation: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="retailCoMingling">
                      Describe how do you ensure your products are not
                      co-mingled with nonorganic:
                    </FieldLabel>
                    <Input
                      placeholder="Describe co-mingling prevention"
                      value={field.value?.retail?.coMinglingPrevention ?? ''}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          retail: {
                            ...field.value?.retail,
                            coMinglingPrevention: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                </FieldSet>
              )}
            </Field>

            {/* Wholesale */}
            <Field>
              <FieldLabel htmlFor="wholesale">Wholesale</FieldLabel>
              <Checkbox
                checked={field.value?.wholesale}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    wholesale: e,
                  })
                }
              />
            </Field>

            {/* Other */}
            <Field>
              <FieldLabel htmlFor="marketOther">Other, describe:</FieldLabel>
              <Checkbox
                checked={field.value?.other?.isOther}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    other: {
                      ...field.value?.other,
                      isOther: e,
                    },
                  })
                }
              />
              {field.value?.other?.isOther && (
                <Input
                  placeholder="Describe other market venues"
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

            {/* No responsibility */}
            <Field>
              <FieldLabel htmlFor="noResponsibility">
                My operation has no responsibility for harvest, transport and
                marketing
              </FieldLabel>
              <Checkbox
                checked={field.value?.noResponsibility}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    noResponsibility: e,
                  })
                }
              />
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
