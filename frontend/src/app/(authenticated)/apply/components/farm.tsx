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
import { Controller, useForm } from 'react-hook-form';
import SubmitButton from '@/components/common/utils/submit-button/submit-button';
import { FadeIn } from '@/components/common';
import { saveApplication } from '../actions';
import { Checkbox } from '@/components/ui/checkbox';
import SplitOperation from './internal-application/split-operation';
import AlternateFarming from './internal-application/alternate-farming';
import FarmActivities from './internal-application/farm-activities';
import ProductionLocation from './internal-application/production-location';
import CultivationPractices from './internal-application/cultivation-practices';
import PestControl from './internal-application/pest-control';

/** The 3rd page of the application (and absolutely the longest). This is where the majority of farm related information is collected. */
export default function Farm({
  defaultValues,
}: {
  defaultValues?: FarmInfoInternalApplicationSelect;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FarmInfoInternalApplicationInsert>({
    defaultValues: defaultValues ?? {},
    resolver: zodResolver(farmInfoInternalApplicationInsertSchema),
  });

  console.log(errors);

  return (
    <FadeIn>
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit(saveApplication)}>
          <h2 className="text-lg font-semibold">General Farm Information</h2>
          <FieldSet className="flex flex-col gap-6 mb-8">
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
                type="number"
                placeholder="e.g., 500"
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
              <Input
                type="text"
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
              <Input
                type="text"
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
              <Input
                type="text"
                placeholder="Include acreage, main crops, practices, irrigation, soil issues"
                {...register('managementZoneStructure')}
              />
            </Field>

            <SplitOperation control={control} errors={errors} />

            <AlternateFarming control={control} errors={errors} />

            <FarmActivities control={control} errors={errors} />
          </FieldSet>

          <h2 className="text-lg font-semibold mt-6">
            Production &amp; Cultivation
          </h2>
          <FieldSet className="flex flex-col gap-6 mb-8">
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
          <h2 className="text-lg font-semibold mt-6">Inputs &amp; Materials</h2>
          <FieldSet className="flex flex-col gap-6 mb-8">
            {/* JSON field placeholder: offFarmProducts */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What off-farm products are used (compost, manure, fertilizers,
                  etc.)?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="offFarmProducts"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            {/* JSON field placeholder: otherMaterials */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What synthetic fertilizers, pesticides, or other materials are
                  used?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="otherMaterials"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>Is the farm in any supplier contracts?</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="supplierContracts"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input
                type="text"
                placeholder="Describe any supplier contracts"
                {...register('supplierContracts')}
              />
            </Field>
          </FieldSet>

          {/* Irrigation & Water */}
          <h2 className="text-lg font-semibold mt-6">Irrigation &amp; Water</h2>
          <FieldSet className="flex flex-col gap-6 mb-8">
            {/* JSON field placeholder: irrigationWaterSource */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  What is the source of your irrigation water?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="irrigationWaterSource"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

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
          <h2 className="text-lg font-semibold mt-6">
            Environmental &amp; Conservation
          </h2>
          <FieldSet className="flex flex-col gap-6 mb-8">
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

            {/* JSON field placeholder: nearContaminationSource */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Is the farm near conventional agriculture or mining that may
                  contaminate?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="nearContaminationSource"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            {/* JSON field placeholder: activeWildAreas */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Are active wild areas reserved for biodiversity on or near the
                  farm?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="activeWildAreas"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

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

          {/* Harvest & Markets */}
          <h2 className="text-lg font-semibold mt-6">Harvest &amp; Markets</h2>
          <FieldSet className="flex flex-col gap-6 mb-8">
            {/* JSON field placeholder: manageHarvests */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>How do you manage your harvests?</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="manageHarvests"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            {/* JSON field placeholder: waterUsedPostHarvest */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Is water used in direct contact with produce post-harvest?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="waterUsedPostHarvest"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            {/* JSON field placeholder: primaryMarketVenues */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>What are your primary market venues?</FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="primaryMarketVenues"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            {/* JSON field placeholder: branding */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  Is your produce packed for another brand or third party?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="branding"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>

            {/* JSON field placeholder: productDifferentiation */}
            <Field>
              <div className="flex flex-row justify-between">
                <FieldLabel>
                  How do you differentiate your produce to consumers?
                </FieldLabel>
                <ErrorMessage
                  errors={errors}
                  name="productDifferentiation"
                  render={({ message }) => (
                    <FormErrorMessage errorMessage={message} />
                  )}
                />
              </div>
              <Input type="text" placeholder="To be implemented" disabled />
            </Field>
          </FieldSet>

          <div className="mt-6">
            <SubmitButton buttonText="SAVE AND NEXT" />
          </div>
        </form>
      </div>
    </FadeIn>
  );
}
