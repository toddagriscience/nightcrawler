// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Soil test file parser (Parser 1).
 *
 * Reads lab report data from a CSV or Excel spreadsheet, converts raw values
 * to PPM where needed, and inserts structured data into the analysis, mineral,
 * and solubility tables.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/parse-soil-test.ts <filepath> [options]
 *
 * Options:
 *   --farm-id <n>        Farm ID to associate analyses with (default: 2)
 *   --zone-id <n>        Force all rows to a specific management zone ID
 *   --date <YYYY-MM-DD>  Analysis date for every row (default: today)
 *   --sheet <name>       Use a specific sheet name instead of auto-detecting
 *   --dry-run            Parse and log without writing to the database
 */

import { db } from '@/lib/db/schema/connection';
import { analysis, managementZone, mineral, solubility } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as xlsx from 'xlsx';

// ---------------------------------------------------------------------------
// Conversion constants
// ---------------------------------------------------------------------------

/** Factors for converting meq/l → PPM */
const MEQ_TO_PPM = {
  Ca: 20.04,
  Mg: 12.15,
  Na: 22.99,
} as const;

/** EC conversion: dS/m → PPM */
const EC_TO_PPM = 640;

/**
 * Ideal EC value in PPM (lower boundary of lab's "Medium/Optimal" range:
 * 1.0 dS/m × 640 = 640 PPM).
 */
const EC_IDEAL_PPM = 640;

// ---------------------------------------------------------------------------
// Four Lows thresholds (Vincent's Data Framework, PPM)
// ---------------------------------------------------------------------------
const FOUR_LOWS_THRESHOLDS = {
  Calcium: 2000,
  Magnesium: 4000,
  Sodium: 10,
  Potassium: 200,
};

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

/**
 * Generates a unique analysis ID in the format XXXXXX-XXXXXX
 * (uppercase alphanumeric, 13 chars total).
 */
function generateAnalysisId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const seg = (n: number) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  return `${seg(6)}-${seg(6)}`;
}

// ---------------------------------------------------------------------------
// Raw lab row
// ---------------------------------------------------------------------------

interface LabRow {
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

/** Result from parseFile: rows + whether Ca/Mg/Na are already PPM. */
interface ParseResult {
  rows: LabRow[];
  alreadyPpm: boolean;
}

// ---------------------------------------------------------------------------
// Header normalisation & column mapping
// ---------------------------------------------------------------------------

/** Strips everything except lowercase letters and digits. */
function normaliseHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Known header variants from lab reports and converted spreadsheets.
 * Keys are normalised header strings; values are LabRow field names.
 */
const HEADER_MAP: Record<string, keyof LabRow> = {
  // Row number
  no: 'no',
  number: 'no',
  // Description / field name
  description: 'description',
  fielddescription: 'description',
  desc: 'description',
  // Depth / crop column (in converted sheets the crop is here)
  depth: 'crop',
  // Saturation percentage
  sp: 'sp',
  // pH
  ph: 'ph',
  // Electrical conductivity
  ec: 'ec',
  ecdsdm: 'ec',
  // Calcium — raw (meq/l) OR converted (ppm)
  ca: 'ca',
  cameql: 'ca',
  ca2: 'ca', // "Ca2+" normalises to "ca2"
  // Magnesium
  mg: 'mg',
  mgmeql: 'mg',
  mg2: 'mg', // "Mg2+"
  // Sodium
  na: 'na',
  nameql: 'na',
  // Chloride
  cl: 'cl',
  // Exchangeable Sodium Percentage
  esp: 'esp',
  // Gypsum Requirement
  gypsumreq: 'gypsumReq',
  // Lime Requirement / Lime Present — both map to lime
  lime: 'lime',
  // Boron
  b: 'b',
  bmgl: 'b',
  // Nitrate-Nitrogen
  no3n: 'no3n',
  no3nmgkg: 'no3n',
  // Phosphate-Phosphorus
  po4p: 'po4p',
  po4pmgkg: 'po4p',
  // Potassium
  k: 'k',
  kmgkg: 'k',
  // Zinc
  zn: 'zn',
  znmgkg: 'zn',
  // Manganese
  mn: 'mn',
  mnmgkg: 'mn',
  // Iron
  fe: 'fe',
  femgkg: 'fe',
  // Copper
  cu: 'cu',
  cumgkg: 'cu',
  // Organic Matter
  om: 'om',
};

/**
 * Headers that, when present, indicate we've found the column header row.
 * We require "pH" plus at least 2 others from this set.
 */
const SENTINEL_HEADERS = new Set([
  'ph',
  'ca',
  'cameql',
  'ca2',
  'mg',
  'mgmeql',
  'mg2',
  'na',
  'nameql',
  'ec',
  'ecdsdm',
  'no3n',
  'no3nmgkg',
  'sp',
  'no',
  'desc',
  'description',
]);

// ---------------------------------------------------------------------------
// File parsing
// ---------------------------------------------------------------------------

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function toStr(v: unknown): string {
  return v === null || v === undefined ? '' : String(v).trim();
}

/** Returns true when a row looks like a units-description row (e.g. "ppm", "%", "mg/L"). */
function isUnitsRow(row: unknown[]): boolean {
  const unitPatterns =
    /^(ppm|%|units|meq\/l|mg\/l|mg\/kg|ds\/m|t\/ac|lbs\/ac)/i;
  let unitCells = 0;
  for (const cell of row) {
    if (unitPatterns.test(toStr(cell))) unitCells++;
  }
  return unitCells >= 2;
}

/**
 * Checks the units row to decide whether Ca/Mg/Na are already in PPM.
 * Returns true if the Ca column's unit says "ppm".
 */
function detectPpmFromUnitsRow(
  unitsRow: unknown[],
  colMap: Partial<Record<keyof LabRow, number>>
): boolean {
  const caIdx = colMap['ca'];
  if (caIdx === undefined) return false;
  const unit = toStr(unitsRow[caIdx]).toLowerCase();
  return unit === 'ppm';
}

/**
 * Picks the best sheet from the workbook. Priority:
 *  1. Sheet whose name contains "soil test" (raw or converted)
 *  2. First sheet
 */
function pickSheet(wb: xlsx.WorkBook, override?: string): string {
  if (override) {
    if (!wb.SheetNames.includes(override)) {
      throw new Error(
        `Sheet "${override}" not found. Available: ${wb.SheetNames.join(', ')}`
      );
    }
    return override;
  }

  for (const name of wb.SheetNames) {
    const lower = name.toLowerCase();
    if (lower.includes('soil test')) return name;
  }
  return wb.SheetNames[0];
}

/**
 * Reads a CSV or Excel file and returns parsed LabRow objects plus a flag
 * indicating whether Ca/Mg/Na values are already in PPM.
 *
 * The parser auto-detects the header row by scanning for a row that contains
 * "pH" and at least 2 other known column headers. It also checks the units
 * row (if present) to decide whether Ca/Mg/Na need meq/l → PPM conversion.
 */
function parseFile(filePath: string, sheetOverride?: string): ParseResult {
  const workbook = xlsx.readFile(filePath, { type: 'file', raw: false });
  const sheetName = pickSheet(workbook, sheetOverride);
  console.log(`Using sheet: "${sheetName}"`);

  const sheet = workbook.Sheets[sheetName];
  const rows: unknown[][] = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
  });

  // --- Locate the header row ---
  let headerRowIdx = -1;
  let colMap: Partial<Record<keyof LabRow, number>> = {};

  for (let i = 0; i < Math.min(rows.length, 30); i++) {
    const norm = (rows[i] as unknown[]).map((c) => normaliseHeader(toStr(c)));
    const hasPh = norm.some((h) => h === 'ph');
    const matchCount = norm.filter((h) => SENTINEL_HEADERS.has(h)).length;

    if (hasPh && matchCount >= 3) {
      headerRowIdx = i;
      for (let j = 0; j < norm.length; j++) {
        const mapped = HEADER_MAP[norm[j]];
        if (mapped !== undefined) {
          // Avoid overwriting with a duplicate (e.g. two "Req." columns)
          if (!(mapped in colMap)) colMap[mapped] = j;
        }
      }
      break;
    }
  }

  if (headerRowIdx === -1) {
    throw new Error(
      'Could not find header row. Expected a row containing "pH" ' +
        'and at least 2 other known soil-test columns (Ca, Mg, Na, EC, etc.).'
    );
  }
  console.log(`Header row at index ${headerRowIdx}`);

  // --- Check for a units row immediately after the header ---
  let dataStartIdx = headerRowIdx + 1;
  let alreadyPpm = false;

  if (dataStartIdx < rows.length) {
    const candidateUnits = rows[dataStartIdx] as unknown[];
    if (isUnitsRow(candidateUnits)) {
      alreadyPpm = detectPpmFromUnitsRow(candidateUnits, colMap);
      console.log(
        `Units row at index ${dataStartIdx} — Ca/Mg/Na already PPM: ${alreadyPpm}`
      );
      dataStartIdx++; // skip the units row
    }
  }

  // --- Parse data rows ---
  const dataRows = rows.slice(dataStartIdx);
  const results: LabRow[] = [];

  for (const raw of dataRows) {
    const row = raw as unknown[];
    const get = (field: keyof LabRow): unknown => {
      const idx = colMap[field];
      return idx !== undefined ? row[idx] : undefined;
    };

    const description = toStr(get('description'));
    const cropRaw = toStr(get('crop')); // may be "(Lettuce)" from Depth col
    const no = toNum(get('no'));

    // Skip blank rows
    if (!description && no === null) continue;

    // Skip footer / reference-range rows
    const descLower = description.toLowerCase();
    if (
      descLower.startsWith('low') ||
      descLower.startsWith('medium') ||
      descLower.startsWith('high') ||
      descLower.startsWith('optimal')
    )
      continue;

    // Skip conversion-note rows (e.g. "(meq/l )/(charge) = mmol/l")
    if (descLower.includes('meq/l') || descLower.includes('mmol/l')) continue;

    // Extract crop annotation — could be in Depth col "(Lettuce)" or at the
    // end of Description "Harden 7 (Lettuce)"
    const cropFromDesc = description.match(/\(([^)]+)\)$/)?.[1] ?? null;
    const crop = cropRaw.replace(/[()]/g, '').trim() || cropFromDesc;

    // pH validation: lab pH must be 0–14; anything outside is corrupt data
    const rawPh = toNum(get('ph'));
    const ph = rawPh !== null && rawPh >= 0 && rawPh <= 14 ? rawPh : null;
    if (rawPh !== null && ph === null) {
      console.log(
        `  ⚠  Row ${no ?? '?'}: pH value ${rawPh} is outside 0–14 — skipped`
      );
    }

    results.push({
      no: no ?? results.length + 1,
      description,
      crop,
      sp: toNum(get('sp')),
      ph,
      ec: toNum(get('ec')),
      ca: toNum(get('ca')),
      mg: toNum(get('mg')),
      na: toNum(get('na')),
      cl: toNum(get('cl')),
      esp: toNum(get('esp')),
      gypsumReq: toNum(get('gypsumReq')),
      lime: toNum(get('lime')),
      b: toNum(get('b')),
      no3n: toNum(get('no3n')),
      po4p: toNum(get('po4p')),
      k: toNum(get('k')),
      zn: toNum(get('zn')),
      mn: toNum(get('mn')),
      fe: toNum(get('fe')),
      cu: toNum(get('cu')),
      om: toNum(get('om')),
    });
  }

  return { rows: results, alreadyPpm };
}

// ---------------------------------------------------------------------------
// PPM conversion + mineral building
// ---------------------------------------------------------------------------

type MineralName =
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

type UnitValue = 'ppm' | '%' | 'dimensionless';

type TagValue = 'Low' | 'Med' | 'High';

interface MineralInsert {
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
const IDEAL_VALUES: Partial<Record<MineralName, number>> = {
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

// ---------------------------------------------------------------------------
// Tag computation (Lab reference ranges)
// ---------------------------------------------------------------------------

/**
 * Determines Low / Med / High tag for a mineral based on lab reference
 * ranges. Ca and Mg tags use meq/l values (converted back from PPM when
 * the sheet is already in PPM); K/Zn/Mn/Fe/OM/pH use their native units.
 */
function computeTag(
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
function buildMinerals(
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

// ---------------------------------------------------------------------------
// Four Lows detection
// ---------------------------------------------------------------------------

/**
 * Returns true when all four base minerals are simultaneously below
 * Vincent's Data Framework thresholds.
 */
function checkFourLows(minerals: MineralInsert[]): boolean {
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

// ---------------------------------------------------------------------------
// Skipped-columns logging
// ---------------------------------------------------------------------------

function logSkipped(row: LabRow) {
  const skipped: string[] = [];
  if (row.cl !== null) skipped.push(`Cl=${row.cl} (Chloride — not stored)`);
  if (row.sp !== null)
    skipped.push(`SP=${row.sp}% (Saturation % — not stored)`);
  if (row.esp !== null)
    skipped.push(`ESP=${row.esp}% (Exchangeable Sodium % — not stored)`);
  if (row.gypsumReq !== null)
    skipped.push(`GypReq=${row.gypsumReq} (Gypsum Req — not stored)`);
  if (row.lime !== null)
    skipped.push(`Lime=${row.lime} (Lime Req — not stored)`);

  if (skipped.length > 0) {
    console.log(`  ⚠  Skipped: ${skipped.join(' | ')}`);
  }
}

// ---------------------------------------------------------------------------
// Management zone lookup / creation
// ---------------------------------------------------------------------------

/**
 * Returns the ID of an existing management zone matching name + farm, or
 * creates one and returns its new ID.
 */
async function getOrCreateZone(
  farmId: number,
  zoneName: string
): Promise<number> {
  const existing = await db
    .select({ id: managementZone.id })
    .from(managementZone)
    .where(
      and(eq(managementZone.farmId, farmId), eq(managementZone.name, zoneName))
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  console.log(`  → Creating management zone "${zoneName}" for farm ${farmId}`);
  const [created] = await db
    .insert(managementZone)
    .values({ farmId, name: zoneName })
    .returning({ id: managementZone.id });

  return created.id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  let filePath: string | null = null;
  let farmId = 2;
  let fixedZoneId: number | null = null;
  let analysisDate = new Date();
  let sheetOverride: string | undefined;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--farm-id':
        farmId = parseInt(args[++i], 10);
        break;
      case '--zone-id':
        fixedZoneId = parseInt(args[++i], 10);
        break;
      case '--date':
        analysisDate = new Date(args[++i]);
        break;
      case '--sheet':
        sheetOverride = args[++i];
        break;
      case '--dry-run':
        dryRun = true;
        break;
      default:
        if (!args[i].startsWith('--')) filePath = args[i];
    }
  }

  if (!filePath) {
    console.error(
      'Usage: NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/parse-soil-test.ts' +
        ' <filepath> [--farm-id <n>] [--zone-id <n>] [--date YYYY-MM-DD]' +
        ' [--sheet <name>] [--dry-run]'
    );
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const dateStr = analysisDate.toISOString().slice(0, 10);
  console.log(`\nFile    : ${path.resolve(filePath)}`);
  console.log(`Farm ID : ${farmId}`);
  console.log(`Date    : ${dateStr}`);
  console.log(`Dry run : ${dryRun}\n`);

  const { rows, alreadyPpm } = parseFile(filePath, sheetOverride);
  console.log(
    `Found ${rows.length} data rows (values ${alreadyPpm ? 'already in PPM' : 'in meq/l — will convert'})\n`
  );

  let inserted = 0;

  for (const row of rows) {
    const label = row.description || `Row ${row.no}`;
    const cropLabel = row.crop ? ` (${row.crop})` : '';
    console.log(`━━ ${row.no}. ${label}${cropLabel}`);

    // ---- Determine management zone ----
    let zoneId: number;

    if (fixedZoneId !== null) {
      zoneId = fixedZoneId;
    } else {
      if (!row.description) {
        console.log(
          '  ✗ No description — skipping (use --zone-id to assign a zone)'
        );
        continue;
      }
      // Strip crop annotation "(Lettuce)" etc. from the zone name
      const zoneName = row.description.replace(/\s*\(.*?\)\s*$/, '').trim();

      if (dryRun) {
        console.log(
          `  → Would look up / create zone: "${zoneName}" (farm ${farmId})`
        );
        zoneId = 0;
      } else {
        zoneId = await getOrCreateZone(farmId, zoneName);
        console.log(`  Zone ID : ${zoneId}`);
      }
    }

    // ---- Build insert data ----
    const analysisId = generateAnalysisId();
    const minerals = buildMinerals(row, analysisId, alreadyPpm);
    const ecPpm = row.ec !== null ? row.ec * EC_TO_PPM : null;
    const fourLows = checkFourLows(minerals);

    // ---- Log ----
    console.log(`  Analysis ID : ${analysisId}`);

    if (minerals.length > 0) {
      console.log(`  Minerals (${minerals.length}):`);
      for (const m of minerals) {
        const tagStr = m.tag ? ` [${m.tag}]` : '';
        const idealStr =
          m.idealValue !== null ? ` (ideal: ${m.idealValue})` : '';
        const flStr = m.fourLows ? ' ⚠4L' : '';
        console.log(
          `    ${m.name.padEnd(22)} ${m.realValue.toFixed(4).padStart(12)} ${m.units}${tagStr}${idealStr}${flStr}`
        );
      }
    }

    if (ecPpm !== null) {
      console.log(
        `  Solubility : EC ${row.ec} dS/m → ${ecPpm.toFixed(2)} PPM` +
          ` (ideal ${EC_IDEAL_PPM} PPM)`
      );
    }

    if (fourLows) {
      console.log(
        `  ⚠  FOUR LOWS DETECTED — Ca/Mg/Na/K all below threshold. ' +
          'Restore soil biology before mineral amendments.`
      );
    }

    logSkipped(row);

    // ---- Insert ----
    if (dryRun) {
      console.log('  [dry-run] Not writing to DB');
      continue;
    }

    await db.insert(analysis).values({
      id: analysisId,
      managementZone: zoneId,
      analysisDate,
    });

    if (minerals.length > 0) {
      await db.insert(mineral).values(
        minerals.map((m) => ({
          analysisId: m.analysisId,
          name: m.name,
          realValue: m.realValue,
          idealValue: m.idealValue,
          units: m.units,
          tag: m.tag,
          fourLows: m.fourLows,
        }))
      );
    }

    if (ecPpm !== null) {
      await db.insert(solubility).values({
        analysisId,
        real_value: String(ecPpm),
        ideal_value: String(EC_IDEAL_PPM),
        units: 'ppm',
      });
    }

    console.log(`  ✓ Inserted`);
    inserted++;
  }

  console.log(`\nDone — inserted ${inserted} / ${rows.length} analyses.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
