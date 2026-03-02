// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** Standard values for various soil parameters per farm. The majority of these values are standard across farms. Unless otherwise specified, the units for these values are all in PPM.
 *
 * Data comes in the following format
 * min -------- low -------- ideal ---------- high / max
 *
 * min is generally 0, unless otherwise specified
 * */
export const standardValues = pgTable('standard_values', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to the farm */
  farmId: integer()
    .references(() => farm.id, { onDelete: 'set null' })
    .notNull()
    .unique(),
  /** Calcium minimum value (PPM — converted from meq/L × 20.04) */
  calciumMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Calcium low value (PPM — converted from meq/L × 20.04; source: 5 meq/L) */
  calciumLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(100.2)
    .notNull(),
  /** Calcium ideal value (PPM — converted from meq/L × 20.04; source: 7.5 meq/L) */
  calciumIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(150.3)
    .notNull(),
  /** Calcium high value (PPM — converted from meq/L × 20.04; source: 10 meq/L) */
  calciumHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(200.4)
    .notNull(),
  /** Calcium maximum acceptable value (PPM — converted from meq/L × 20.04) */
  calciumMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(200.4)
    .notNull(),
  /** pH minimum value (dimensionless — cannot be converted to PPM) */
  phMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** pH low value (dimensionless — cannot be converted to PPM; source: 7.3) */
  phLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(7.3)
    .notNull(),
  /** pH ideal value (dimensionless — cannot be converted to PPM; source: midpoint of 7.3–7.8) */
  phIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(7.55)
    .notNull(),
  /** pH high value (dimensionless — cannot be converted to PPM; source: 7.8) */
  phHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(7.8)
    .notNull(),
  /** pH maximum acceptable value (dimensionless — cannot be converted to PPM) */
  phMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(7.8)
    .notNull(),
  /** Salts minimum value (PPM — converted from dS/m × 640) */
  saltsMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Salts low value (PPM — converted from dS/m × 640; source: 1.0 dS/m) */
  saltsLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(640)
    .notNull(),
  /** Salts ideal value (PPM — converted from dS/m × 640; source: 1.5 dS/m) */
  saltsIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(960)
    .notNull(),
  /** Salts high value (PPM — converted from dS/m × 640; source: 2.0 dS/m) */
  saltsHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(1280)
    .notNull(),
  /** Salts maximum acceptable value (PPM — converted from dS/m × 640) */
  saltsMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(1280)
    .notNull(),
  /** Magnesium minimum value (PPM — converted from meq/L × 12.15) */
  magnesiumMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Magnesium low value (PPM — converted from meq/L × 12.15; source: 3 meq/L) */
  magnesiumLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(36.45)
    .notNull(),
  /** Magnesium ideal value (PPM — converted from meq/L × 12.15; source: 1/2 Ca = 3.75 meq/L) */
  magnesiumIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(45.56)
    .notNull(),
  /** Magnesium high value (PPM — converted from meq/L × 12.15; source: > Ca = 10 meq/L) */
  magnesiumHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(121.5)
    .notNull(),
  /** Magnesium maximum acceptable value (PPM — converted from meq/L × 12.15) */
  magnesiumMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(121.5)
    .notNull(),
  /** Exchangeable Sodium Percentage min value in PPM. MADE UP VALUE, based off of no other information. */
  exchangeableSodiumPercentageMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Exchangeable Sodium Percentage low value in PPM. MADE UP VALUE, based off of no other information. */
  exchangeableSodiumPercentageLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(200)
    .notNull(),
  /** Exchangeable Sodium Percentage ideal value in PPM. MADE UP VALUE, based off of no other information. */
  exchangeableSodiumPercentageIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(500)
    .notNull(),
  /** Exchangeable Sodium Percentage high value in PPM. MADE UP VALUE, based off of no other information. */
  exchangeableSodiumPercentageHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(700)
    .notNull(),
  /** Exchangeable Sodium Percentage maximum acceptable value (percentage — cannot be converted to PPM) */
  exchangeableSodiumPercentageMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(700)
    .notNull(),
  /** Nitrate Nitrogen minimum value (PPM — source unit: mg/kg) */
  nitrateNitrogenMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Nitrate Nitrogen low value (PPM — source unit: mg/kg; source: 20 mg/kg) */
  nitrateNitrogenLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(20)
    .notNull(),
  /** Nitrate Nitrogen ideal value (PPM — source unit: mg/kg; source: midpoint of 20–30 mg/kg) */
  nitrateNitrogenIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(25)
    .notNull(),
  /** Nitrate Nitrogen high value (PPM — source unit: mg/kg; source: 30 mg/kg) */
  nitrateNitrogenHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(30)
    .notNull(),
  /** Nitrate Nitrogen maximum acceptable value (PPM — source unit: mg/kg) */
  nitrateNitrogenMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(30)
    .notNull(),
  /** Phosphate Phosphorus minimum value (PPM — source unit: mg/kg) */
  phosphatePhosphorusMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Phosphate Phosphorus low value (PPM — source unit: mg/kg; source: 50 mg/kg) */
  phosphatePhosphorusLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(50)
    .notNull(),
  /** Phosphate Phosphorus ideal value (PPM — source unit: mg/kg; source: midpoint of 50–60 mg/kg) */
  phosphatePhosphorusIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(55)
    .notNull(),
  /** Phosphate Phosphorus high value (PPM — source unit: mg/kg; source: 60 mg/kg) */
  phosphatePhosphorusHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(60)
    .notNull(),
  /** Phosphate Phosphorus maximum acceptable value (PPM — source unit: mg/kg) */
  phosphatePhosphorusMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(60)
    .notNull(),
  /** Potassium minimum value (PPM — source unit: mg/kg) */
  potassiumMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Potassium low value (PPM — source unit: mg/kg; source: 250 mg/kg) */
  potassiumLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(250)
    .notNull(),
  /** Potassium ideal value (PPM — source unit: mg/kg; source: midpoint of 250–350 mg/kg) */
  potassiumIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(300)
    .notNull(),
  /** Potassium high value (PPM — source unit: mg/kg; source: 350 mg/kg) */
  potassiumHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(350)
    .notNull(),
  /** Potassium maximum acceptable value (PPM — source unit: mg/kg) */
  potassiumMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(350)
    .notNull(),
  /** Zinc minimum value (PPM — source unit: mg/kg) */
  zincMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Zinc low value (PPM — source unit: mg/kg; source: 2.5 mg/kg) */
  zincLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(2.5)
    .notNull(),
  /** Zinc ideal value (PPM — source unit: mg/kg; source: midpoint of 2.5–4.5 mg/kg) */
  zincIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(3.5)
    .notNull(),
  /** Zinc high value (PPM — source unit: mg/kg; source: 4.5 mg/kg) */
  zincHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(4.5)
    .notNull(),
  /** Zinc maximum acceptable value (PPM — source unit: mg/kg) */
  zincMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(4.5)
    .notNull(),
  /** Iron minimum value (PPM — source unit: mg/kg) */
  ironMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Iron low value (PPM — source unit: mg/kg; source: 5 mg/kg) */
  ironLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(5)
    .notNull(),
  /** Iron ideal value (PPM — source unit: mg/kg; source: midpoint of 5–10 mg/kg) */
  ironIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(7.5)
    .notNull(),
  /** Iron high value (PPM — source unit: mg/kg; source: 10 mg/kg) */
  ironHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(10)
    .notNull(),
  /** Iron maximum acceptable value (PPM — source unit: mg/kg) */
  ironMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(10)
    .notNull(),
  /** Organic Matter minimum value (percentage — cannot be converted to PPM) */
  organicMatterMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Organic Matter low value (percentage — cannot be converted to PPM; source: 1.0%) */
  organicMatterLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(1.0)
    .notNull(),
  /** Organic Matter ideal value (percentage — cannot be converted to PPM; source: midpoint of 1–3%) */
  organicMatterIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(2.0)
    .notNull(),
  /** Organic Matter high value (percentage — cannot be converted to PPM; source: 3.0%) */
  organicMatterHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(3.0)
    .notNull(),
  /** Organic Matter maximum acceptable value (percentage — cannot be converted to PPM) */
  organicMatterMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(3.0)
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
