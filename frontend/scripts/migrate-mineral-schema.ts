// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * One-time migration: update the mineral table and related enums to support
 * Manganese, Copper, Boron, ideal_value, tag, four_lows, and dimensionless units.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 bun run scripts/migrate-mineral-schema.ts
 */

import { db } from '@/lib/db/schema/connection';
import { sql } from 'drizzle-orm';

async function inspect() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CURRENT DATABASE STATE');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. mineral_types enum values
  const mineralTypesEnum = await db.execute(
    sql`SELECT unnest(enum_range(NULL::mineral_types))::text AS value`
  );
  console.log(
    'mineral_types enum:',
    mineralTypesEnum.rows.map((r: Record<string, unknown>) => r.value)
  );

  // 2. units enum values
  const unitsEnum = await db.execute(
    sql`SELECT unnest(enum_range(NULL::units))::text AS value`
  );
  console.log(
    'units enum:',
    unitsEnum.rows.map((r: Record<string, unknown>) => r.value)
  );

  // 3. Check if mineral_tag enum exists
  const tagEnumExists = await db.execute(
    sql`SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mineral_tag') AS exists`
  );
  console.log(
    'mineral_tag enum exists:',
    tagEnumExists.rows[0].exists
  );

  // 4. mineral table columns
  const mineralCols = await db.execute(sql`
    SELECT column_name, data_type, udt_name, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'mineral'
    ORDER BY ordinal_position
  `);
  console.log('\nmineral table columns:');
  for (const row of mineralCols.rows) {
    const r = row as Record<string, unknown>;
    console.log(
      `  ${String(r.column_name).padEnd(20)} ${String(r.udt_name).padEnd(20)} nullable=${r.is_nullable}`
    );
  }
  console.log('');
}

async function migrate() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  APPLYING MIGRATIONS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // --- 1. Add missing values to mineral_types enum ---
  const mineralTypesEnum = await db.execute(
    sql`SELECT unnest(enum_range(NULL::mineral_types))::text AS value`
  );
  const existingMineralTypes = new Set(
    mineralTypesEnum.rows.map((r: Record<string, unknown>) => r.value as string)
  );

  for (const val of ['Manganese', 'Copper', 'Boron']) {
    if (existingMineralTypes.has(val)) {
      console.log(`  ✓ mineral_types already has '${val}'`);
    } else {
      await db.execute(
        sql.raw(`ALTER TYPE mineral_types ADD VALUE IF NOT EXISTS '${val}'`)
      );
      console.log(`  + Added '${val}' to mineral_types`);
    }
  }

  // --- 2. Add 'dimensionless' to units enum ---
  const unitsEnum = await db.execute(
    sql`SELECT unnest(enum_range(NULL::units))::text AS value`
  );
  const existingUnits = new Set(
    unitsEnum.rows.map((r: Record<string, unknown>) => r.value as string)
  );

  if (existingUnits.has('dimensionless')) {
    console.log(`  ✓ units already has 'dimensionless'`);
  } else {
    await db.execute(
      sql`ALTER TYPE units ADD VALUE IF NOT EXISTS 'dimensionless'`
    );
    console.log(`  + Added 'dimensionless' to units`);
  }

  // --- 3. Create mineral_tag enum if it doesn't exist ---
  const tagEnumExists = await db.execute(
    sql`SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mineral_tag') AS exists`
  );

  if (tagEnumExists.rows[0].exists) {
    console.log(`  ✓ mineral_tag enum already exists`);
  } else {
    await db.execute(
      sql`CREATE TYPE mineral_tag AS ENUM ('Low', 'Med', 'High')`
    );
    console.log(`  + Created mineral_tag enum ('Low', 'Med', 'High')`);
  }

  // --- 4. Add missing columns to mineral table ---
  const mineralCols = await db.execute(sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'mineral'
  `);
  const existingCols = new Set(
    mineralCols.rows.map((r: Record<string, unknown>) => r.column_name as string)
  );

  // ideal_value
  if (existingCols.has('ideal_value')) {
    console.log(`  ✓ mineral.ideal_value already exists`);
  } else {
    await db.execute(
      sql`ALTER TABLE mineral ADD COLUMN ideal_value numeric(9,4)`
    );
    console.log(`  + Added mineral.ideal_value (numeric(9,4), nullable)`);
  }

  // tag
  if (existingCols.has('tag')) {
    console.log(`  ✓ mineral.tag already exists`);
  } else {
    await db.execute(
      sql`ALTER TABLE mineral ADD COLUMN tag mineral_tag`
    );
    console.log(`  + Added mineral.tag (mineral_tag enum, nullable)`);
  }

  // four_lows
  if (existingCols.has('four_lows')) {
    console.log(`  ✓ mineral.four_lows already exists`);
  } else {
    await db.execute(
      sql`ALTER TABLE mineral ADD COLUMN four_lows boolean`
    );
    console.log(`  + Added mineral.four_lows (boolean, nullable)`);
  }

  console.log('');
}

async function main() {
  try {
    await inspect();
    await migrate();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('  POST-MIGRATION STATE');
    console.log('═══════════════════════════════════════════════════════════\n');
    await inspect();

    console.log('Done.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
  process.exit(0);
}

main();
