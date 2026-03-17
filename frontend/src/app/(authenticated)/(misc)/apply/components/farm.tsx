// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FarmInfoInternalApplicationInsert,
  FarmInfoInternalApplicationSelect,
} from '@/lib/types/db';
import { cn } from '@/lib/utils';
import { farmInfoInternalApplicationInsertSchema } from '@/lib/zod-schemas/db';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { saveApplication } from '../actions';
import { ApplicationContext } from './application-tabs';
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

/** The 3rd page of the application (and absolutely the longest). This is where the majority of farm related information is collected. */
export default function Farm() {
  const { internalApplication, farmInfo, setCurrentTab, canEditFarm } =
    useContext(ApplicationContext);
  const defaultValues = {
    ...internalApplication,
    farmId: farmInfo.farmId!,
  } as FarmInfoInternalApplicationSelect;
  const methods = useForm<FarmInfoInternalApplicationInsert>({
    defaultValues: defaultValues ?? {},
    resolver: zodResolver(farmInfoInternalApplicationInsertSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  async function save(formData: FarmInfoInternalApplicationInsert) {
    if (!canEditFarm) {
      return;
    }

    await saveApplication(formData);
  }

  async function onChangeHelper() {
    if (!canEditFarm) {
      return;
    }

    const delay = 5 * 1000;
    if (new Date().getTime() - lastSaved.getTime() > delay) {
      handleSubmit(save)();
      setLastSaved(new Date());
    }
  }

  return (
    <div className="mt-6">
      <div>
        <FormProvider {...methods}>
          <form
            className={cn(
              'mt-6 flex max-w-3xl flex-col gap-6',
              !canEditFarm && 'pointer-events-none opacity-70'
            )}
            onSubmit={() => {
              handleSubmit(save)();
              setCurrentTab('subscription');
              scrollTo(0, 0);
            }}
            onChange={onChangeHelper}
          >
            {!canEditFarm && (
              <p className="rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
                Viewers can review this section but cannot edit it.
              </p>
            )}
            <h2 className="text-lg font-semibold">General Farm Information</h2>
            <FieldSet className="mx-auto mb-8 flex flex-col gap-6">
              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border-[#848484]/80 border-1 bg-transparent"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 150000.00"
                  {...register('totalGrossIncome')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
                    Total acreage of the farm
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="totalAcreage"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border-[#848484]/80 border-1 bg-transparent"
                  type="number"
                  placeholder="e.g., 7"
                  {...register('totalAcreage', { valueAsNumber: true })}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  placeholder="e.g., Tomatoes, Lettuce, Carrots"
                  {...register('mainCrops')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  placeholder="If yes, describe your conservation plan"
                  {...register('conservationPlan')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  placeholder="Include acreage, main crops, practices, irrigation, soil issues"
                  {...register('managementZoneStructure')}
                />
              </Field>

              <SplitOperation />

              <AlternateFarming />

              <FarmActivities />
            </FieldSet>

            <h2 className="mt-6 text-lg font-semibold">
              Production &amp; Cultivation
            </h2>
            <FieldSet className="mb-8 flex flex-col gap-6">
              <ProductionLocation />

              <CultivationPractices />

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Describe species, amount, manure management, etc."
                  {...register('livestockIncorporation')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Describe crop rotation, cover crops, fallow periods"
                  {...register('weedInsectDiseasesControl')}
                />
              </Field>

              <PestControl />

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Describe seeding/planting equipment"
                  {...register('mechanicalEquipment')}
                />
              </Field>
            </FieldSet>

            {/* Inputs & Materials */}
            <h2 className="mt-6 text-lg font-semibold">
              Inputs &amp; Materials
            </h2>
            <FieldSet className="mb-8 flex flex-col gap-6">
              <OffFarmProducts />

              <OtherMaterials />

              <SupplierContracts />
            </FieldSet>

            <h2 className="mt-6 text-lg font-semibold">
              Irrigation &amp; Water
            </h2>
            <FieldSet className="mb-8 flex flex-col gap-6">
              <IrrigationWaterSource />

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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Crop requirements, rainfall, soil types, evaporation"
                  {...register('irrigationScheduling')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
                    How is soil moisture monitored?
                  </FieldLabel>
                  <ErrorMessage
                    errors={errors}
                    name="soilMoistureMonitoring"
                    render={({ message }) => (
                      <FormErrorMessage errorMessage={message} />
                    )}
                  />
                </div>
                <Input
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Describe monitoring methods for irrigation efficiency"
                  {...register('soilMoistureMonitoring')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Fertigation, line cleaners, pH adjusters, etc."
                  {...register('irrigationMaterials')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Describe water conservation practices"
                  {...register('waterConservation')}
                />
              </Field>

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
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
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="No-till, cover cropping, terraces, windbreaks, etc."
                  {...register('erosionPrevention')}
                />
              </Field>

              <NearContaminationSource />

              <ActiveWildAreas />

              <Field>
                <div className="flex flex-row justify-between">
                  <FieldLabel className="leading-tight mb-[-6px]">
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
                  className="border-[#848484]/80 border-1 bg-transparent"
                  type="text"
                  placeholder="Borders, fallow land, non-farming habitats"
                  {...register('naturalResources')}
                />
              </Field>
            </FieldSet>

            <h2 className="mt-6 text-lg font-semibold">
              Harvest &amp; Markets
            </h2>
            <FieldSet className="mb-8 flex flex-col gap-6">
              <ManageHarvests />

              <WaterUsedPostHarvest />

              <PrimaryMarketVenues />

              <Branding />

              <ProductDifferentiation />
            </FieldSet>

            {canEditFarm && (
              <SubmitButton
                reactHookFormPending={isSubmitting}
                buttonText="Save and next"
              />
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
