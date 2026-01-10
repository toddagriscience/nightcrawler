import { pgEnum } from 'drizzle-orm/pg-core';

/** A general tag for different levels of quantity. */
export const level_category = pgEnum('amt_category', [
  'Low',
  'Med',
  'High',
]);


/** Renamed tags for solubility, pH, etc. */
export const solubilityLevel = level_category.enumValues;
export const phLevel = level_category.enumValues;
export const mineralLevel = level_category.enumValues;
export const contaminationRisk = level_category.enumValues;
