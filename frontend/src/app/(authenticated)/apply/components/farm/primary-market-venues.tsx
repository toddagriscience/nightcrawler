// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
          <FieldSet className="flex flex-col gap-2">
            {/* Community Supported Agriculture (CSA) */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.csa}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    csa: e,
                  })
                }
              />
              <FieldLabel htmlFor="csa">
                Community Supported Agriculture (CSA)
              </FieldLabel>
            </Field>

            {/* Copacking Services */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="copackingServices">
                Copacking Services
              </FieldLabel>
            </Field>
            {field.value?.copackingServices?.isCopackingServices && (
              <div className="mb-4 ml-6">
                <FieldLabel htmlFor="copackingAddress" className="mb-2">
                  Address of Post-Harvest Handling
                </FieldLabel>
                <Textarea
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
              </div>
            )}

            {/* Export */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="export" className="whitespace-nowrap">
                Export
              </FieldLabel>
            </Field>
            {field.value?.export?.isExport && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                {/* Foreign markets */}
                <div>
                  <FieldLabel className="mb-4">
                    Which foreign markets do you export to, directly or
                    indirectly (including as by-products or through
                    brokers/traders, etc.)?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={field.value?.export?.foreignMarkets?.canadaEu}
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
                      <FieldLabel htmlFor="exportCanadaEu">
                        We export to Canada, the EU, UK, Japan, Korea,
                        Switzerland or Taiwan
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
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
                      <FieldLabel htmlFor="exportMexico">
                        We export to Mexico
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
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
                                  ...field.value?.export?.foreignMarkets?.other,
                                  isOther: e,
                                },
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel
                        htmlFor="exportOther"
                        className="whitespace-nowrap"
                      >
                        Other, describe:
                      </FieldLabel>
                    </Field>
                    {field.value?.export?.foreignMarkets?.other?.isOther && (
                      <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                        <Textarea
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
                      </div>
                    )}
                  </div>
                </div>

                {/* Final processing/packaging */}
                <div>
                  <FieldLabel className="mb-4">
                    Does final processing/packaging occur in the US?
                  </FieldLabel>
                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal">
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
                                  : field.value?.export?.finalProcessing?.some,
                                no: e
                                  ? false
                                  : field.value?.export?.finalProcessing?.no,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel htmlFor="processingYes">
                        Yes, I plan to export products produced, processed or
                        packaged in the US.
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
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
                                  ...field.value?.export?.finalProcessing?.some,
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
                      <FieldLabel htmlFor="processingSome">
                        Some products I plan to export are produced, processed
                        or packaged outside the US.
                      </FieldLabel>
                    </Field>
                    {field.value?.export?.finalProcessing?.some?.isSome && (
                      <div className="mb-4 flex flex-row flex-wrap items-center gap-3">
                        <Textarea
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
                      </div>
                    )}
                    <Field orientation="horizontal">
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
                                  : field.value?.export?.finalProcessing?.some,
                              },
                            },
                          })
                        }
                      />
                      <FieldLabel
                        htmlFor="processingNo"
                        className="whitespace-nowrap"
                      >
                        No
                      </FieldLabel>
                    </Field>
                  </div>
                </div>

                {/* Prevent non-compliant export */}
                <div>
                  <FieldLabel htmlFor="preventNonCompliant" className="mb-2">
                    How do you prevent export of products that are not compliant
                    for the destination market? Describe:
                  </FieldLabel>
                  <Textarea
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
                </div>
              </div>
            )}

            {/* Farmer's Market */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="farmersMarket">
                Farmer&apos;s Market
              </FieldLabel>
            </Field>
            {field.value?.farmersMarket?.isFarmersMarket && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="farmersMarketName" className="mb-2">
                    Name:
                  </FieldLabel>
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
                </div>
                <div>
                  <FieldLabel htmlFor="farmersMarketAddress" className="mb-2">
                    Address:
                  </FieldLabel>
                  <Textarea
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
                </div>
                <Field orientation="horizontal">
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
                  <FieldLabel htmlFor="sellsNonOrganic">
                    Do they sell non-organic produce?
                  </FieldLabel>
                </Field>
              </div>
            )}

            {/* Ingredients */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.ingredients}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    ingredients: e,
                  })
                }
              />
              <FieldLabel htmlFor="ingredients" className="whitespace-nowrap">
                Ingredients
              </FieldLabel>
            </Field>

            {/* Website */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="website" className="whitespace-nowrap">
                Website
              </FieldLabel>
            </Field>
            {field.value?.website?.isWebsite && (
              <div className="mb-4 ml-6">
                <FieldLabel htmlFor="websiteDomain" className="mb-2">
                  Domain
                </FieldLabel>
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
              </div>
            )}

            {/* Produce Stand */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.produceStand}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    produceStand: e,
                  })
                }
              />
              <FieldLabel htmlFor="produceStand" className="whitespace-nowrap">
                Produce Stand
              </FieldLabel>
            </Field>

            {/* Retail */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="retail" className="whitespace-nowrap">
                Retail
              </FieldLabel>
            </Field>
            {field.value?.retail?.isRetail && (
              <div className="mb-4 ml-6 flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="retailNameLocation" className="mb-2">
                    Name and location of retailers
                  </FieldLabel>
                  <Textarea
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
                </div>
                <div>
                  <FieldLabel htmlFor="retailCoMingling" className="mb-2">
                    Describe how do you ensure your products are not co-mingled
                    with nonorganic:
                  </FieldLabel>
                  <Textarea
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
                </div>
              </div>
            )}

            {/* Wholesale */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.wholesale}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    wholesale: e,
                  })
                }
              />
              <FieldLabel htmlFor="wholesale" className="whitespace-nowrap">
                Wholesale
              </FieldLabel>
            </Field>

            {/* Other */}
            <Field orientation="horizontal">
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
              <FieldLabel htmlFor="marketOther" className="whitespace-nowrap">
                Other, describe:
              </FieldLabel>
            </Field>
            {field.value?.other?.isOther && (
              <div className="mb-4 ml-6 flex flex-row flex-wrap items-center gap-3">
                <Textarea
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
              </div>
            )}

            {/* No responsibility */}
            <Field orientation="horizontal">
              <Checkbox
                checked={field.value?.noResponsibility}
                onCheckedChange={(e) =>
                  field.onChange({
                    ...field.value,
                    noResponsibility: e,
                  })
                }
              />
              <FieldLabel htmlFor="noResponsibility">
                My operation has no responsibility for harvest, transport and
                marketing
              </FieldLabel>
            </Field>
          </FieldSet>
        )}
      />
    </Field>
  );
}
