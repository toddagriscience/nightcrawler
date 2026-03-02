// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  FarmInfoInternalApplicationSelect,
  FarmInfoInternalApplicationInsert,
} from '@/lib/types/db';
import { farmInfoInternalApplicationInsertSchema } from '@/lib/zod-schemas/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { useForm } from 'react-hook-form';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { saveApplication } from '../actions';
import {
  ActiveWildAreas,
  AlternateFarming,
  Branding,
  CultivationPractices,
  FarmActivities,
  IrrigationWaterSource,
  ManageHarvests,
  NearContaminationSource,
  OffFarmProducts,
  OtherMaterials,
  PestControl,
  PrimaryMarketVenues,
  ProductDifferentiation,
  ProductionLocation,
  SplitOperation,
  SupplierContracts,
  WaterUsedPostHarvest,
} from './farm/index';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { TabTypes } from '../types';

/** The 3rd page of the application (and absolutely the longest). This is where the majority of farm related information is collected. */
export default function Farm({
  defaultValues,
  setCurrentTab,
}: {
  defaultValues?: FarmInfoInternalApplicationSelect;
  setCurrentTab: (arg0: TabTypes) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FarmInfoInternalApplicationInsert>({
    defaultValues: defaultValues ?? {},
    resolver: zodResolver(farmInfoInternalApplicationInsertSchema),
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  async function save(formData: FarmInfoInternalApplicationInsert) {
    await saveApplication(formData);
  }

  async function onChangeHelper() {
    const delay = 5 * 1000;
    if (new Date().getTime() - lastSaved.getTime() > delay) {
      handleSubmit(save)();
      setLastSaved(new Date());
    }
  }

  return (
    <div className="mt-6">
      <div>
        <form
          className="mt-6 flex max-w-3xl flex-col gap-6"
          onSubmit={() => {
            handleSubmit(save)();
            setCurrentTab('terms');
            scrollTo(0, 0);
          }}
          onChange={onChangeHelper}
        >
          <h2 className="text-lg font-semibold">General Farm Information</h2>
          <FieldSet className="mx-auto mb-8 flex flex-col gap-6">
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Total gross income on certified crops/products (preceding 12
                  months)
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="totalGrossIncome"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                step="0.01"
                placeholder="e.g., 150000.00"
                {...register('totalGrossIncome')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Total acreage of the farm</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="totalAcreage"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                placeholder="e.g., 7"
                {...register('totalAcreage', { valueAsNumber: true })}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What are your main crops or highest demand produce?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="mainCrops"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Textarea
                placeholder="e.g., Tomatoes, Lettuce, Carrots"
                {...register('mainCrops')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Do you have a current conservation plan/contract with USDA
                  NRCS or other conservation agency?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="conservationPlan"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Textarea
                placeholder="If yes, describe your conservation plan"
                {...register('conservationPlan')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  How do you structure your management zones or fields?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="managementZoneStructure"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Textarea
                placeholder="Include acreage, main crops, practices, irrigation, soil issues"
                {...register('managementZoneStructure')}
              />
            </Field>

            <SplitOperation control={control} errors={errors} />

            <AlternateFarming control={control} errors={errors} />

            <FarmActivities control={control} errors={errors} />
          </FieldSet>

          <h2 className="mt-6 text-lg font-semibold">
            Production &amp; Cultivation
          </h2>
          <FieldSet className="mb-8 flex flex-col gap-6">
            <ProductionLocation control={control} errors={errors} />

            <CultivationPractices control={control} errors={errors} />

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Is livestock incorporated into your farming system?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="livestockIncorporation"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Describe species, amount, manure management, etc."
                {...register('livestockIncorporation')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What measures are taken to reduce weed, insect, and disease
                  issues?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="weedInsectDiseasesControl"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Describe crop rotation, cover crops, fallow periods"
                {...register('weedInsectDiseasesControl')}
              />
            </Field>

            <PestControl control={control} errors={errors} />

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What mechanical equipment is used for production?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="mechanicalEquipment"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Describe seeding/planting equipment"
                {...register('mechanicalEquipment')}
              />
            </Field>
          </FieldSet>

          {/* Inputs & Materials */}
          <h2 className="mt-6 text-lg font-semibold">Inputs &amp; Materials</h2>
          <FieldSet className="mb-8 flex flex-col gap-6">
            <OffFarmProducts control={control} errors={errors} />

            <OtherMaterials control={control} errors={errors} />

            <SupplierContracts register={register} errors={errors} />
          </FieldSet>

          <h2 className="mt-6 text-lg font-semibold">Irrigation &amp; Water</h2>
          <FieldSet className="mb-8 flex flex-col gap-6">
            <IrrigationWaterSource control={control} errors={errors} />

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What factors are considered in irrigation scheduling?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="irrigationScheduling"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Crop requirements, rainfall, soil types, evaporation"
                {...register('irrigationScheduling')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>How is soil moisture monitored?</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="soilMoistureMonitoring"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Describe monitoring methods for irrigation efficiency"
                {...register('soilMoistureMonitoring')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Do you apply materials via irrigation water?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="irrigationMaterials"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Fertigation, line cleaners, pH adjusters, etc."
                {...register('irrigationMaterials')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  How is water conservation or rainwater utilization measured?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="waterConservation"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Describe water conservation practices"
                {...register('waterConservation')}
              />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  How is water quality protected from runoff?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="waterQualityProtection"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Protection for rivers, ponds, wetlands in watershed"
                {...register('waterQualityProtection')}
              />
            </Field>
          </FieldSet>

          {/* Environmental & Conservation */}
          <h2 className="mt-6 text-lg font-semibold">
            Environmental &amp; Conservation
          </h2>
          <FieldSet className="mb-8 flex flex-col gap-6">
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What measures are taken to prevent or minimize erosion?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="erosionPrevention"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="No-till, cover cropping, terraces, windbreaks, etc."
                {...register('erosionPrevention')}
              />
            </Field>

            <NearContaminationSource control={control} errors={errors} />

            <ActiveWildAreas control={control} errors={errors} />

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  How do you maintain natural resources in non-crop areas?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="naturalResources"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Borders, fallow land, non-farming habitats"
                {...register('naturalResources')}
              />
            </Field>
          </FieldSet>

          <h2 className="mt-6 text-lg font-semibold">Harvest &amp; Markets</h2>
          <FieldSet className="mb-8 flex flex-col gap-6">
            <ManageHarvests control={control} errors={errors} />

            <WaterUsedPostHarvest control={control} errors={errors} />

            <PrimaryMarketVenues control={control} errors={errors} />

            <Branding control={control} errors={errors} />

            <ProductDifferentiation control={control} errors={errors} />
          </FieldSet>

          <SubmitButton
            reactHookFormPending={isSubmitting}
            buttonText="SAVE AND NEXT"
          />
        </form>
      </div>
    </div>
  );
}
