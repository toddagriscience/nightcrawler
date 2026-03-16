// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Cleanup: remove the 9 analyses from the first parser run (farm_id=2)
 * and their child mineral + solubility rows.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/cleanup-first-run.ts
 */

import { db } from '@/lib/db/schema/connection';
import { sql } from 'drizzle-orm';

/** Subquery that selects all analysis IDs belonging to farm_id=2 */
const FARM2_IDS = sql`(
  SELECT a.id FROM analysis a
  JOIN management_zone mz ON mz.id = a.management_zone
  WHERE mz.farm_id = 2
)`;

async function main() {
  // 1. Show analyses
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  INSPECTING EXISTING DATA (farm_id=2)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const analyses = await db.execute(sql`
    SELECT a.id, a.analysis_date, mz.name AS zone_name
    FROM analysis a
    JOIN management_zone mz ON mz.id = a.management_zone
    WHERE mz.farm_id = 2
    ORDER BY a.id
  `);

  console.log(`Found ${analyses.rows.length} analyses for farm_id=2:\n`);
  for (const r of analyses.rows) {
    const row = r as Record<string, unknown>;
    console.log(
      `  ${row.id}  ${String(row.analysis_date).slice(0, 10)}  zone: ${row.zone_name}`
    );
  }

  if (analyses.rows.length === 0) {
    console.log('Nothing to clean up.');
    process.exit(0);
  }

  // 2. Show mineral rows
  const minerals = await db.execute(sql`
    SELECT m.analysis_id, m.name, m.real_value, m.units,
           m.ideal_value, m.tag, m.four_lows
    FROM mineral m
    WHERE m.analysis_id IN ${FARM2_IDS}
    ORDER BY m.analysis_id, m.id
  `);
  console.log(`\nMineral rows to delete: ${minerals.rows.length}`);
  for (const r of minerals.rows) {
    const row = r as Record<string, unknown>;
    console.log(
      `  ${String(row.analysis_id)}  ${String(row.name).padEnd(22)} ${String(row.real_value).padStart(12)} ${row.units}  ideal=${row.ideal_value ?? 'NULL'}  tag=${row.tag ?? 'NULL'}  4L=${row.four_lows ?? 'NULL'}`
    );
  }

  // 3. Show solubility rows
  const solubilities = await db.execute(sql`
    SELECT s.analysis_id, s.real_value, s.ideal_value, s.units
    FROM solubility s
    WHERE s.analysis_id IN ${FARM2_IDS}
    ORDER BY s.analysis_id
  `);
  console.log(`\nSolubility rows to delete: ${solubilities.rows.length}`);
  for (const r of solubilities.rows) {
    const row = r as Record<string, unknown>;
    console.log(
      `  ${row.analysis_id}  real=${row.real_value}  ideal=${row.ideal_value}  ${row.units}`
    );
  }

  // 4. Delete: children first, then analyses
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  DELETING');
  console.log('═══════════════════════════════════════════════════════════\n');

  const delMinerals = await db.execute(sql`
    DELETE FROM mineral WHERE analysis_id IN ${FARM2_IDS}
  `);
  console.log(`  Deleted ${delMinerals.rowCount} mineral rows`);

  const delSolubility = await db.execute(sql`
    DELETE FROM solubility WHERE analysis_id IN ${FARM2_IDS}
  `);
  console.log(`  Deleted ${delSolubility.rowCount} solubility rows`);

  const delAnalyses = await db.execute(sql`
    DELETE FROM analysis a
    USING management_zone mz
    WHERE mz.id = a.management_zone AND mz.farm_id = 2
  `);
  console.log(`  Deleted ${delAnalyses.rowCount} analysis rows`);

  // 5. Verify
  const remaining = await db.execute(sql`
    SELECT count(*) AS cnt
    FROM analysis a
    JOIN management_zone mz ON mz.id = a.management_zone
    WHERE mz.farm_id = 2
  `);
  console.log(
    `\n  Remaining analyses for farm_id=2: ${(remaining.rows[0] as Record<string, unknown>).cnt}`
  );

  console.log('\nCleanup complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
