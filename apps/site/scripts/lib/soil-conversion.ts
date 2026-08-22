// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Pure soil-test conversion logic shared by `parse-soil-test.ts` and its tests.
 *
 * Kept free of database and filesystem dependencies so the unit math
 * (meq/l → PPM, lab-range tags, Four Lows detection) can be exercised in
 * isolation.
 */

/** Factors for converting meq/l → PPM. */
export const MEQ_TO_PPM = {
  Ca: 20.04,
  Mg: 12.15,
  Na: 22.99,
} as const;

/** Four Lows thresholds (Vincent's Data Framework, PPM). */
export const FOUR_LOWS_THRESHOLDS = {
  Calcium: 2000,
  Magnesium: 4000,
  Sodium: 10,
  Potassium: 200,
};

/** Canonical mineral names stored in the `mineral` table. */
export type MineralName =
  | 'Calcium'
  | 'Magnesium'
  | 'Sodium'
  | 'Potassium'
  | 'PH'
  | 'NitrateNitrogen'
  | 'PhosphatePhosphorus'
  | 'Zinc'
  | 'Iron'
  | 'OrganicMatter'
  | 'Manganese'
  | 'Copper'
  | 'Boron';

/** Storage unit for a mineral value. */
export type UnitValue = 'ppm' | '%' | 'dimensionless';

/** Low / Med / High classification from lab reference ranges. */
export type TagValue = 'Low' | 'Med' | 'High';

/** A single parsed lab row, before conversion to mineral records. */
export interface LabRow {
  no: number;
  description: string;
  crop: string | null; // extracted from Depth or Description parenthetical
  sp: number | null; // Saturation percentage
  ph: number | null;
  ec: number | null; // dS/m — raw lab value
  ca: number | null; // meq/l or PPM (depending on needsConversion)
  mg: number | null; // meq/l or PPM
  na: number | null; // meq/l or PPM
  cl: number | null;
  esp: number | null;
  gypsumReq: number | null;
  lime: number | null;
  b: number | null; // mg/l  — Boron
  no3n: number | null; // mg/kg — Nitrate-Nitrogen
  po4p: number | null; // mg/kg — Phosphate-Phosphorus
  k: number | null; // mg/kg — Potassium
  zn: number | null; // mg/kg — Zinc
  mn: number | null; // mg/kg — Manganese (not in DB enum)
  fe: number | null; // mg/kg — Iron
  cu: number | null; // mg/kg — Copper (not in DB enum)
  om: number | null; // %     — Organic Matter
}

/** A mineral record ready to insert, with ideal value, tag, and Four Lows flag. */
export interface MineralInsert {
  analysisId: string;
  name: MineralName;
  realValue: number;
  idealValue: number | null;
  units: UnitValue;
  tag: TagValue | null;
  fourLows: boolean;
}

// ---------------------------------------------------------------------------
// Vincent's Data Framework — ideal values (PPM unless noted)
// ---------------------------------------------------------------------------
export const IDEAL_VALUES: Partial<Record<MineralName, number>> = {
  Calcium: 16000,
  Magnesium: 11000,
  Sodium: 500,
  Potassium: 1200,
  Copper: 1.5,
  Zinc: 1.5,
  Iron: 85,
  Manganese: 40,
  Boron: 0.5,
  PhosphatePhosphorus: 1100,
  // PH ideal stored as midpoint of 6.5–7.0
  PH: 6.75,
};

/**
 * Determines Low / Med / High tag for a mineral based on lab reference
 * ranges. Ca and Mg tags use meq/l values (converted back from PPM when
 * the sheet is already in PPM); K/Zn/Mn/Fe/OM/pH use their native units.
 */
export function computeTag(
  name: MineralName,
  row: LabRow,
  alreadyPpm: boolean
): TagValue | null {
  // For Ca/Mg, lab ranges are in meq/l. When alreadyPpm, convert back.
  const caRaw =
    row.ca !== null ? (alreadyPpm ? row.ca / MEQ_TO_PPM.Ca : row.ca) : null;
  const mgRaw =
    row.mg !== null ? (alreadyPpm ? row.mg / MEQ_TO_PPM.Mg : row.mg) : null;

  switch (name) {
    case 'PH': {
      const v = row.ph;
      if (v === null) return null;
      if (v < 7.3) return 'Low';
      if (v <= 7.8) return 'Med';
      return 'High';
    }
    case 'Calcium': {
      if (caRaw === null) return null;
      if (caRaw < 5) return 'Low';
      if (caRaw <= 10) return 'Med';
      return 'High';
    }
    case 'Magnesium': {
      // Low: <3 meq/l, High: Mg > Ca in meq/l, else Med
      if (mgRaw === null) return null;
      if (mgRaw < 3) return 'Low';
      if (caRaw !== null && mgRaw > caRaw) return 'High';
      return 'Med';
    }
    case 'Potassium': {
      const v = row.k;
      if (v === null) return null;
      if (v < 250) return 'Low';
      if (v <= 350) return 'Med';
      return 'High';
    }
    case 'Zinc': {
      const v = row.zn;
      if (v === null) return null;
      if (v < 2.5) return 'Low';
      if (v <= 4.5) return 'Med';
      return 'High';
    }
    case 'Manganese': {
      const v = row.mn;
      if (v === null) return null;
      if (v < 2.5) return 'Low';
      if (v <= 10) return 'Med';
      return 'High';
    }
    case 'Iron': {
      const v = row.fe;
      if (v === null) return null;
      if (v < 5) return 'Low';
      if (v <= 10) return 'Med';
      return 'High';
    }
    case 'OrganicMatter': {
      const v = row.om;
      if (v === null) return null;
      if (v < 1.0) return 'Low';
      if (v <= 3) return 'Med';
      return 'High';
    }
    default:
      // Na, NO3-N, PO4-P, Cu, B — no lab reference ranges
      return null;
  }
}

/**
 * Converts a LabRow to an array of mineral insert records.
 *
 * When `alreadyPpm` is false, Ca/Mg/Na are converted from meq/l → PPM
 * using Vincent's conversion factors. When true, values are stored as-is.
 *
 * Each mineral row includes ideal_value from Vincent's Data Framework,
 * a Low/Med/High tag from lab reference ranges, and a four_lows flag.
 */
export function buildMinerals(
  row: LabRow,
  analysisId: string,
  alreadyPpm: boolean
): MineralInsert[] {
  const minerals: MineralInsert[] = [];

  const add = (
    name: MineralName,
    value: number | null,
    units: UnitValue = 'ppm'
  ) => {
    if (value !== null && !isNaN(value)) {
      minerals.push({
        analysisId,
        name,
        realValue: value,
        idealValue: IDEAL_VALUES[name] ?? null,
        units,
        tag: computeTag(name, row, alreadyPpm),
        fourLows: false, // set after all minerals are built
      });
    }
  };

  if (alreadyPpm) {
    add('Calcium', row.ca);
    add('Magnesium', row.mg);
    add('Sodium', row.na);
  } else {
    add('Calcium', row.ca !== null ? row.ca * MEQ_TO_PPM.Ca : null);
    add('Magnesium', row.mg !== null ? row.mg * MEQ_TO_PPM.Mg : null);
    add('Sodium', row.na !== null ? row.na * MEQ_TO_PPM.Na : null);
  }

  // Already in mg/kg (= PPM) regardless of sheet type
  add('Potassium', row.k);
  add('NitrateNitrogen', row.no3n);
  add('PhosphatePhosphorus', row.po4p);
  add('Zinc', row.zn);
  add('Iron', row.fe);
  add('Manganese', row.mn);
  add('Copper', row.cu);
  add('Boron', row.b); // mg/l ≈ PPM for dilute solutions

  // pH — dimensionless
  add('PH', row.ph, 'dimensionless');

  // Organic matter — percentage
  add('OrganicMatter', row.om, '%');

  // Set four_lows on the four base minerals
  const fl = checkFourLows(minerals);
  if (fl) {
    for (const m of minerals) {
      if (
        m.name === 'Calcium' ||
        m.name === 'Magnesium' ||
        m.name === 'Sodium' ||
        m.name === 'Potassium'
      ) {
        m.fourLows = true;
      }
    }
  }

  return minerals;
}

/**
 * Returns true when all four base minerals are simultaneously below
 * Vincent's Data Framework thresholds.
 */
export function checkFourLows(minerals: MineralInsert[]): boolean {
  const get = (name: MineralName) =>
    minerals.find((m) => m.name === name)?.realValue ?? null;

  const ca = get('Calcium');
  const mg = get('Magnesium');
  const na = get('Sodium');
  const k = get('Potassium');

  return (
    ca !== null &&
    ca < FOUR_LOWS_THRESHOLDS.Calcium &&
    mg !== null &&
    mg < FOUR_LOWS_THRESHOLDS.Magnesium &&
    na !== null &&
    na < FOUR_LOWS_THRESHOLDS.Sodium &&
    k !== null &&
    k < FOUR_LOWS_THRESHOLDS.Potassium
  );
}
