// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** Application certification types */
export const applicationCertificationType = pgEnum(
  'application_certification_type',
  ['Organic', 'Biodynamic', 'Regenerative Organic']
);

/** Split operation types */
export const splitOperationType = pgEnum('split_operation_type', [
  'Grow both organic and conventional crops in the same parcel',
  'Grow identical crops organically and conventionally in separate parcels',
  'Maintain exempt production zones',
]);

/** Production alternation status */
export const productionAlternationStatus = pgEnum(
  'production_alternation_status',
  ['No', 'Yes, in the past', 'Yes, we currently alternate production']
);

/** Past three years activity types */
export const pastActivityType = pgEnum('past_activity_type', [
  'Fallow',
  'Cover cropping',
  'Pasture',
  'Production of crops',
  'Other',
]);

/** Production facility types */
export const productionFacilityType = pgEnum('production_facility_type', [
  'Not applicable',
  'Greenhouse',
  'Shadehouse',
  'Buildings',
  'Other',
]);

/** Pest control types */
export const pestControlType = pgEnum('pest_control_type', [
  'Prevention practices are effective and additional controls are not needed at this time',
  'Mechanical or physical controls, including traps, light, or sound',
  'Pest control materials (e.g. applied via fumigation or fogging)',
]);

/** Seed type categories */
export const seedTypeCategory = pgEnum('seed_type_category', [
  'Organic certified',
  'Biodynamic certified',
  'Organic, treated',
  'Conventional',
  'Conventional, treated',
]);

/** Transplant type categories */
export const transplantTypeCategory = pgEnum('transplant_type_category', [
  'Organic certified',
  'Biodynamic certified',
  'Conventional',
]);

/** Irrigation source types */
export const irrigationSourceType = pgEnum('irrigation_source_type', [
  'Well',
  'Reservoir',
  'Water district',
  'Fish bearing river, stream, or lake',
  'Effluent',
]);

/** Harvest management types */
export const harvestManagementType = pgEnum('harvest_management_type', [
  'My operation performs the harvest',
  'My operation (or my contracting handler, e.g. shipper, marketer, buyer) hires a contract harvester to harvest my crop',
  'Other responsibility for harvest',
  'Not applicable, no responsibility for harvest (e.g. crop is sold "in the field")',
]);

/** Disinfectant types */
export const disinfectantType = pgEnum('disinfectant_type', [
  'Detergent, soap or cleaner',
  'Chlorine (calcium hypochlorite, chlorine dioxide, sodium hypochlorite, or hypochlorous acid generated from electrolyzed water)',
  'Chlorine, other',
  'Peracetic acid/peroxyacetic acid',
  'Phosphoric acid',
  'Ethanol or Isopropanol',
  'Citric acid',
  'Hydrogen peroxide',
  'Ozone',
  'Quaternary ammonium',
  'Other',
]);

/** Market venue types */
export const marketVenueType = pgEnum('market_venue_type', [
  'Community Supported Agriculture (CSA)',
  'Copacking Services',
  'Export',
  "Farmer's Market",
  'Ingredients',
  'Website',
  'Produce Stand',
  'Retail',
  'Wholesale',
  'Other',
]);

/** Product differentiation types */
export const productDifferentiationType = pgEnum(
  'product_differentiation_type',
  [
    'Twist Ties, Stickers or Rubber Bands',
    'Newsletter or Delivery List',
    'Description on Website or Marketing Material',
    'Signage',
    'Other',
    'Not applicable',
  ]
);

/** PAGE 1: Basic farm information and certifications */
export const organicApplicationBasic = pgTable(
  'organic_application_basic',
  {
    farmId: integer()
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Total gross income on certified crops/products or total market value of agricultural product for the preceding twelve months */
    grossIncome: numeric({ precision: 15, scale: 2 }),
    /** Do you have a current conservation plan/contract with the USDA Natural Resources Conservation Service (NRCS) or other conservation agency? */
    hasConservationPlan: boolean().default(false),
    /** Description of conservation plan practices */
    conservationPlanDescription: text(),
    /** Does your operation alternate organic and conventional farming? */
    alternatesProduction: productionAlternationStatus(),
    /** By checking this box, I certify that I have the authority to complete this application on behalf of farm name */
    authorityCertification: boolean().default(false),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_basic_farm_id_idx').on(table.farmId),
  ]
);

/** Farm certifications with year (not expiration date) */
export const organicApplicationCertification = pgTable(
  'organic_application_certification',
  {
    id: serial().primaryKey(),
    farmId: integer()
      .notNull()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Type of certification */
    type: applicationCertificationType().notNull(),
    /** Year the certification was received */
    certificationYear: integer().notNull(),
  }
);

/** Split operation details */
export const organicApplicationSplitOperation = pgTable(
  'organic_application_split_operation',
  {
    id: serial().primaryKey(),
    farmId: integer()
      .notNull()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Type of split operation */
    type: splitOperationType().notNull(),
  }
);

/** PAGE 3: Crop and production information */
export const organicApplicationCropInfo = pgTable(
  'organic_application_crop_info',
  {
    farmId: integer()
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** What are your main crops or highest demand produce? */
    mainCrops: text(),
    /** What is the total acreage of farm name? */
    totalAcreage: numeric({ precision: 10, scale: 2 }),
    /** How do you structure your management zones or fields? */
    managementZonesDescription: text(),
    /** Describe your plan to provide for pest management and introduce biological diversity in lieu of crop rotation */
    pestManagementPlan: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_crop_info_farm_id_idx').on(table.farmId),
  ]
);

/** Past three years activities */
export const organicApplicationPastActivity = pgTable(
  'organic_application_past_activity',
  {
    id: serial().primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Type of activity */
    type: pastActivityType().notNull(),
    /** Start month */
    startMonth: integer(),
    /** Start year */
    startYear: integer(),
    /** End month */
    endMonth: integer(),
    /** End year */
    endYear: integer(),
    /** Crops associated with this activity */
    crops: text(),
  }
);

/** Production facilities (greenhouses, shadehouses, etc.) */
export const organicApplicationProductionFacility = pgTable(
  'organic_application_production_facility',
  {
    id: serial().primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Type of facility */
    type: productionFacilityType('type').notNull(),
    /** Description of the facility */
    description: text('description'),
    /** Does your operation also have conventional production in greenhouses, shadehouses, or buildings? */
    hasConventionalProduction: boolean('has_conventional_production').default(
      false
    ),
    /** Description of conventional production setup */
    conventionalProductionDescription: text(
      'conventional_production_description'
    ),
  }
);

/** Cultivation practices - stored as JSONB for flexibility */
export const organicApplicationCultivation = pgTable(
  'organic_application_cultivation',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Selected cultivation practices as JSON array */
    practices: jsonb('practices'),
    /** Do you apply raw animal manure (including any compost, compost tea, or vermicompost containing manure is not composted), and/or do you have planned grazing of animals in your organic crop production areas? */
    rawManureApplication: boolean('raw_manure_application').default(false),
    /** Planned grazing of animals in organic crop production areas */
    plannedGrazing: boolean('planned_grazing').default(false),
    /** Compost with manure - ingredients, percentage produced on farm, Biodynamic preparations */
    compostWithManure: text('compost_with_manure'),
    /** Compost without manure - ingredients, percentage produced on farm, Biodynamic preparations */
    compostWithoutManure: text('compost_without_manure'),
    /** Is livestock incorporated into your farming system? */
    livestockDescription: text('livestock_description'),
    /** What, if any, measures are taken to reduce weed, insect and diseases? */
    weedInsectDiseaseMeasures: text('weed_insect_disease_measures'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_cultivation_farm_id_idx').on(table.farmId),
  ]
);

/** Pest control information */
export const organicApplicationPestControl = pgTable(
  'organic_application_pest_control',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Selected pest control types */
    types: jsonb('types'),
    /** How you prevent pest control materials from contaminating soil and crops (if pest control materials selected) */
    contaminationPrevention: text('contamination_prevention'),
    /** How you record pest control material use and measures taken to protect organic crops */
    recordingMeasures: text('recording_measures'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_pest_control_farm_id_idx').on(
      table.farmId
    ),
  ]
);

/** Off-farm products */
export const organicApplicationOffFarmProducts = pgTable(
  'organic_application_off_farm_products',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Off-farm products description: product name, manufacturer, reason for use, last application */
    products: text('products'),
    /** I have verified that any manure-based farm inputs, including compost and formulated products, do not contain manure that is sourced from intensive livestock operations/confinement operations */
    verifiedManureInputs: boolean('verified_manure_inputs').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_off_farm_products_farm_id_idx').on(
      table.farmId
    ),
  ]
);

/** Seed and transplant information - stored as JSONB for complex nested structure */
export const organicApplicationSeeds = pgTable(
  'organic_application_seeds',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Seed types and verification details as JSONB */
    seedTypes: jsonb('seed_types'),
    /** Transplant types and verification details as JSONB */
    transplantTypes: jsonb('transplant_types'),
    /** General characteristics required for seed and planting stock */
    requiredCharacteristics: jsonb('required_characteristics'),
    /** How do you source your seed or transplants? */
    sourcingMethod: text('sourcing_method'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_seeds_farm_id_idx').on(table.farmId),
  ]
);

/** Synthetic materials usage */
export const organicApplicationSyntheticMaterials = pgTable(
  'organic_application_synthetic_materials',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** No materials of any kind are used */
    noMaterialsUsed: boolean('no_materials_used').default(false),
    /** Product name, manufacturer, reason for use, last application */
    products: text('products'),
    /** Farm uses NPK, describe */
    npkUse: text('npk_use'),
    /** Farm uses sodium (Chilean) nitrate, describe */
    sodiumNitrateUse: text('sodium_nitrate_use'),
    /** Existing installations of lumber treated with arsenate */
    treatedLumber: text('treated_lumber'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_synthetic_materials_farm_id_idx').on(
      table.farmId
    ),
  ]
);

/** Equipment and contracts */
export const organicApplicationEquipment = pgTable(
  'organic_application_equipment',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Mechanical equipment and/or seeding/planting equipment for production */
    equipment: text('equipment'),
    /** Is farm in any supplier contracts? */
    hasSupplierContracts: boolean('has_supplier_contracts').default(false),
    /** What are the products or services? */
    supplierContractsDescription: text('supplier_contracts_description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_equipment_farm_id_idx').on(table.farmId),
  ]
);

/** Irrigation information */
export const organicApplicationIrrigation = pgTable(
  'organic_application_irrigation',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Irrigation sources as JSONB array */
    sources: jsonb('sources'),
    /** Name of water district (if water district selected) */
    waterDistrictName: varchar({ length: 200 }),
    /** Does your cropland share irrigation lines or irrigation water (including tail water) with other cropland? */
    sharesIrrigation: boolean('shares_irrigation').default(false),
    /** Description of shared irrigation */
    sharedIrrigationDescription: text('shared_irrigation_description'),
    /** Name of water body (if fish bearing selected) */
    waterBodyName: varchar({ length: 200 }),
    /** What, if any, crop requirements, rainfall, soil types, and evaporation rate are considered in irrigation scheduling? */
    irrigationScheduling: text('irrigation_scheduling'),
    /** How is soil moisture monitored to improve irrigation efficiency? */
    soilMoistureMonitoring: text('soil_moisture_monitoring'),
    /** Do you apply materials to organic crops or land via irrigation water? */
    appliesMaterialsViaIrrigation: boolean(
      'applies_materials_via_irrigation'
    ).default(false),
    /** Description of materials applied via irrigation */
    irrigationMaterialsDescription: text('irrigation_materials_description'),
    /** How, if any, is water conservation or rain water utilization measured? */
    waterConservation: text('water_conservation'),
    /** How, if in action, is water quality protected in rivers, ponds and wetlands located in your farms watershed from runoff? */
    waterQualityProtection: text('water_quality_protection'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_irrigation_farm_id_idx').on(table.farmId),
  ]
);

/** Erosion prevention and contamination risk */
export const organicApplicationErosionContamination = pgTable(
  'organic_application_erosion_contamination',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** What, if any, measures are taken to prevent or minimize erosion? */
    erosionPrevention: text('erosion_prevention'),
    /** Is farm near conventional agriculture or mining that may present the potential for contamination? */
    contaminationRisk: boolean('contamination_risk').default(false),
    /** Description of contamination risk */
    contaminationDescription: text('contamination_description'),
    /** Contamination prevention measures as JSONB array */
    contaminationPreventionMeasures: jsonb('contamination_prevention_measures'),
    /** Link to drift monitoring profile (if applicable) */
    driftMonitoringProfileLink: varchar({ length: 500 }),
    /** Describe the non-crop buffer zones on the perimeter of the farm */
    bufferZonesDescription: text('buffer_zones_description'),
    /** Are active wild areas reserved for biological diversity located on or near the farm? */
    wildAreasDescription: text('wild_areas_description'),
    /** How, if in action, do you improve and/or maintain natural resources in non-crop areas? */
    naturalResourcesMaintenance: text('natural_resources_maintenance'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_erosion_contamination_farm_id_idx').on(
      table.farmId
    ),
  ]
);

/** Harvest management */
export const organicApplicationHarvest = pgTable(
  'organic_application_harvest',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Harvest management type */
    managementType: harvestManagementType('management_type'),
    /** Name and address of contract harvester */
    contractHarvesterAddress: text('contract_harvester_address'),
    /** Is ownership of crops transferred before or upon delivery to the facility? */
    ownershipTransferred: boolean('ownership_transferred'),
    /** Other responsibility for harvest description */
    otherHarvestDescription: text('other_harvest_description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_harvest_farm_id_idx').on(table.farmId),
  ]
);

/** Post-harvest water use */
export const organicApplicationPostHarvest = pgTable(
  'organic_application_post_harvest',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Is water used in direct contact with produce post-harvest? */
    waterUsedPostHarvest: boolean('water_used_post_harvest').default(false),
    /** If you treat wash water on-site, does treated water meet Safe Drinking Water Act Standards? */
    washWaterMeetsStandards: boolean('wash_water_meets_standards'),
    /** Are disinfectants used? */
    disinfectantsUsed: boolean('disinfectants_used').default(false),
    /** Disinfectant types as JSONB array */
    disinfectantTypes: jsonb('disinfectant_types'),
    /** Other disinfectant description */
    otherDisinfectantDescription: text('other_disinfectant_description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_post_harvest_farm_id_idx').on(
      table.farmId
    ),
  ]
);

/** Market venues - stored as JSONB for complex nested structure */
export const organicApplicationMarkets = pgTable(
  'organic_application_markets',
  {
    farmId: integer('farm_id')
      .primaryKey()
      .references(() => farm.id, { onDelete: 'cascade' }),
    /** Market venues as JSONB with nested data */
    marketVenues: jsonb('market_venues'),
    /** Is your produce packed for another brand, or do you use branding owned by a third party? */
    thirdPartyBranding: boolean('third_party_branding').default(false),
    /** Third party branding details as JSONB */
    thirdPartyBrandingDetails: jsonb('third_party_branding_details'),
    /** Product differentiation methods as JSONB array */
    productDifferentiation: jsonb('product_differentiation'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('organic_application_markets_farm_id_idx').on(table.farmId),
  ]
);
