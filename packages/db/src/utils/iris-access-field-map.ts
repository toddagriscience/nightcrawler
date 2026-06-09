// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Form slugs whose submissions hydrate farm tables on platform-access signup.
 */
export const FARM_HYDRATION_FORM_SLUGS = ['iris-access'] as const;

/** Keys copied to user/farm prefill — not mapped to operational tables. */
export const PREFILL_ANSWER_KEYS = new Set([
  'firstName',
  'first_name',
  'lastName',
  'last_name',
  'farmName',
  'farm_name',
  'email',
  'phone',
  'retentionConsent',
]);

/** `farm` table columns populated from form answers. */
export const FARM_ANSWER_COLUMNS = new Set([
  'informalName',
  'businessName',
  'businessWebsite',
  'managementStartDate',
]);

/** `farm_location` table columns populated from form answers. */
export const FARM_LOCATION_ANSWER_COLUMNS = new Set([
  'address1',
  'address2',
  'address3',
  'state',
  'postalCode',
  'country',
  'countyState',
  'apn',
]);

/** `farm_certificate` table columns populated from form answers. */
export const FARM_CERTIFICATE_ANSWER_COLUMNS = new Set([
  'hasGAP',
  'GAPDate',
  'hasLocalInspection',
  'localInspectionDate',
  'hasOrganic',
  'organicDate',
  'hasBiodynamic',
  'biodynamicDate',
  'hasRegenerativeOrganic',
  'regenerativeOrganic',
  'hasNone',
]);

/** Scalar text/numeric columns on `farm_info_internal_application`. */
export const FARM_INFO_SCALAR_COLUMNS = new Set([
  'totalGrossIncome',
  'totalAcreage',
  'mainCrops',
  'conservationPlan',
  'managementZoneStructure',
  'livestockIncorporation',
  'weedInsectDiseasesControl',
  'mechanicalEquipment',
  'irrigationScheduling',
  'soilMoistureMonitoring',
  'irrigationMaterials',
  'waterConservation',
  'waterQualityProtection',
  'erosionPrevention',
  'naturalResources',
  'supplierContracts',
]);

/** JSONB columns on `farm_info_internal_application`. */
export const FARM_INFO_JSONB_COLUMNS = new Set([
  'splitOperation',
  'alternateFarming',
  'farmActivites',
  'productionLocation',
  'cultivationPractices',
  'pestControl',
  'offFarmProducts',
  'otherMaterials',
  'irrigationWaterSource',
  'nearContaminationSource',
  'activeWildAreas',
  'manageHarvests',
  'waterUsedPostHarvest',
  'primaryMarketVenues',
  'branding',
  'productDifferentiation',
]);

/**
 * Textarea answers stored in advisor notes instead of structured columns.
 * Extend as iris-access form fields are added in Sanity.
 */
export const ADVISOR_NOTE_FIELD_LABELS: Record<string, string> = {
  operationalNotes: 'Operational notes',
  diseaseManagementNotes: 'Disease management',
  alignmentNotes: 'Alignment notes',
};

/** UI-only keys not persisted to farm tables. */
export const SKIP_ANSWER_KEYS = new Set(['hasAddress', '_hp']);
