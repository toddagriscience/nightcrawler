// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  pgTable,
  integer,
  text,
  jsonb,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** @fileoverview
 * Why JSONB everywhere and not columns? We might want to "hotswap" some questions in and out as we go along, and since this data is only for internal use, we can afford to be a little bit "messy" with it.
 *
 * For each field, the overarching question is given as documentation. If the field is `jsonb()`, there may be other sub-questions not listed. Please refer to the Application Questions spreadsheet for more information. */

/** Generic farm info from the application */
export const farmInfoInternalApplication = pgTable(
  'farm_info_internal_application',
  {
    farmId: integer()
      .references(() => farm.id, { onDelete: 'set null' })
      .primaryKey(),
    /** A split operation is an operation that produces both organic and conventional crops. Mark any of the following that apply to your operation: */
    splitOperation: jsonb().$type<Record<string, any>>(),
    /** Does your operation alternate organic and convestional farming?	*/
    alternateFarming: jsonb().$type<Record<string, any>>(),
    /** Total gross income on certified crops/products or total market value of agricultural product for the preceding twelve months */
    totalGrossIncome: numeric({ precision: 8, scale: 2 }),
    /** Do you have a current conservation plan/contract with the USDA Natural Resources Conservation Service (NRCS) or other conservation agency? */
    conservationPlan: text(),
    /** What are your main crops or highest demand produce? */
    mainCrops: text(),
    /** What is the total acerage of `farm name`? */
    totalAcreage: integer(),
    /** How do you structure your management zones or fields? include acerage, main crops, different practices per field, irrigation, soil issues */
    managementZoneStructure: text(),
    /** What crop production or other activities have occurred at `farm name` during the past three years? */
    farmActivites: jsonb().$type<Record<string, any>>(),
    /** Does any production take place in greenhouses, shadehouses, or buildings? */
    productionLocation: jsonb().$type<Record<string, any>>(),
    /** What cultivation practices are performed throughout the crop season to maintain or improve the physical, chemical, or biological condition of the soil? */
    cultivationPractices: jsonb().$type<Record<string, any>>(),
    /** Is livestock incorperated into your farming system? (Describe. Include the species and amount or what reasons for not having livestock, in situations such as intensive grazing, how is the manure incorperated into compost. When animales have access, and removed.) */
    livestockIncorporation: text(),
    /** What, if any, measures are taken to reduce weed, insect and dieseases? (the planned sequence of plant families, cover crops, and any fallow periods; the length of each planting or stage in the sequence; the total length of time to complete the planned rotation sequence) */
    weedInsectDiseasesControl: text(),
    /** What, if any, measures are taken to prevent or control pests? */
    pestControl: jsonb().$type<Record<string, any>>(),
    /** What, if any, off-farm products, including commerical compost, manure, gypsum, limestone, micronutrients, or other fertilizers/soil amendments. */
    offFarmProducts: jsonb().$type<Object>(),
    /** What, if any, synthedic fertilizers, pesticides, fungicides, or any other materials such as treated seed (including coatings, pelleting materials, and inoculants), growing media (substrate, planting mix, potting soil), adjuvants, etc. */
    otherMaterials: jsonb().$type<Object>(),
    /** What, if any, mechnaical equipment and/or seeding/planting equipment for production? */
    mechanicalEquipment: text(),
    /** Is `farm name` in any supplier contracts? */
    supplierContracts: text(),
    /** What is the source of your irrigation water? (select all that apply) */
    irrigationWaterSource: jsonb().$type<Object>(),
    /** What, if any, crop requirements, rainfall, soil types, and evaporation rate are considered in irrigation scheduling? */
    irrigationScheduling: text(),
    /** How is soil moisture monitored to improve irrigation efficiency in order to avoid excessive water application? */
    soilMoistureMonitoring: text(),
    /** Do you apply materials to organic crops or land via irrigation water (e.g. fertigation, irrigation line cleaners, pH adjusters, etc.)? */
    irrigationMaterials: text(),
    /** How, if any, is water conservation or rain water utilization measured? */
    waterConservation: text(),
    /** How, if in action, is water quality protected in rivers, ponds and wetlands located in your farms watershed from runoff? */
    waterQualityProtection: text(),
    /** What, if any, measures are taken to prevent or minimize erosion? (No-till or permanent cover, Strip cropping, Leveling, Contour farming, Terraces, Cover cropping, Conservation (minimum) tillage, Micro-irrigate, Windbreaks, Minimize bare ground via crop rotation) */
    erosionPrevention: text(),
    /** Is `farm name` near conventional agriculture or mining that may present the potential for contamination? */
    nearContaminationSource: jsonb().$type<Object>(),
    /** Are active wild areas reserved for biolocical diversity located on or near the farm? including soil type and condition, bodies of water, nearby wetlands and woodlands, wildlife, windbreaks, hedgerows, native habitat and beneficial plantings. Include any problem areas such as erosion and invasive species. */
    activeWildAreas: jsonb().$type<Object>(),
    /** How, if in action, do you improve and/or maintain natural resources in non-crop areas, such as borders, fallow land, and non farming habitats? */
    naturalResources: text(),
    /** How do you manage your harvests? */
    manageHarvests: jsonb().$type<Object>(),
    /** Is water used in direct contact with produce post-harvest? */
    waterUsedPostHarvest: jsonb().$type<Object>(),
    /** What are your primary market venues? */
    primaryMarketVenues: jsonb().$type<Object>(),
    /** Is your produce packed for another brand, or do you use branding owned by a third party? */
    branding: jsonb().$type<Object>(),
    /** How do you differentiate your produce to your consumers? (select all that apply) */
    productDifferentiation: jsonb().$type<Object>(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  }
);
