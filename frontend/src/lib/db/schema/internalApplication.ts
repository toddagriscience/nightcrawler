// Copyright © Todd Agriscience, Inc. All rights reserved.

import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** A collection of open ended questions from the "Expected Activities" section of the Internal APplication. The rough outline of the question is given as documentation for each field. */
export const farmApplicationActivities = pgTable(
  'farm_application_activities',
  {
    farmId: integer()
      .primaryKey()
      .references(() => farm.id),
    /** If there is a potential for contamination, what measures are in place to prevent or otherwise avoid contamination? */
    contamination: text(),
    /** What, if any, are the farm's management strategies to reduce weed, insect or dieseases? */
    managementStrategies: text(),
    /** How, if any, is water conservation or rain water utilization measured? */
    water: text(),
    /** How, if in action, is water quality protected in rivers, ponds, wetlands located in your farms watershed? */
    waterQuality: text(),
    /** What crops are you expecting to grow? */
    expectedCrops: text(),
    /** How are you distributing your produce? */
    distribution: text(),
  }
);

/** A collection of open ended questions from the "Farm Information" section of the Internal Application. The rough outline of the question is given as the documentation for each field. */
export const farmApplicationFarmInfo = pgTable('farm_application_farm_info', {
  farmId: integer('farm_id')
    .primaryKey()
    .references(() => farm.id),
  /** Who are your target customers? */
  targetCustomers: text('target_customers'),
  /** What is your budget? */
  budget: text('budget'),
  /** What are your main crops or highest demand produce? */
  mainCrops: text('main_crops'),
  /** Is on-farm composting part of your farming system? (describe ingredents, what percentage is produced on the farm, are Biodynamic preparations used) */
  onFarmComposting: text('on_farm_composting'),
  /** Is your farm near conventional agriculture or mining that may cause contamination? */
  conventionalAgriculture: text('conventional_agriculture'),
  /** Does the farm use NPK fertilizer? If yes, when was the last time NPK was used? */
  npkFertilizer: text('npk_fertilizer'),
  /** Is the farm in any supplier contracts? If yes, what are the products or services? */
  supplierContracts: text('supplier_contracts'),
  /** Are cover crops utilized during non production times? */
  coverCrops: text('cover_crops'),
  /** Are active wild areas reserved for biolocical diversity located on or near the farm? */
  activeWildAreas: text('active_wild_areas'),
  /** Are crop rotation strategize in place that avoid the build-up insects and diseases? */
  cropRotationStrategies: text('crop_rotation_strategies'),
  /** Is monoculture avoided (including monoculture of vegetable crops)? */
  monoculture: text('monoculture'),
  /** Is livestock incorperated into your farming system (include the species and amount or what reasons for not having livestock, in situations such as intensive grazing, how is the manure incorperated into compost) */
  livestockIncorporation: text('livestock_incorporation'),
  /** Does the farm irrigation pull out of fish bearing water ways, or have fish bearing water ways located on the farm? */
  farmIrrigationFish: text('farm_irrigation_fish'),
  /** Is crop requirements, rainfall, soil types, and evaporation rate considered in irrigation scheduling? */
  irrigationScheduling: text('irrigation_scheduling'),
  /** Is soil moisture monitored to improve irrigation efficiency in order to avoid excessive water application? */
  soilMoisture: text('soil_moisture'),
  /** Do any inputs come from potential GMO sources (i.e seed meal, silage) */
  gmoSources: text('gmo_sources'),
  /** Estimated monthly revenue */
  estimatedMonthly: text('estimated_monthly'),
});
