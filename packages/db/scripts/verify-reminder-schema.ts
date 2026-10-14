// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview Read-only release check for the schema used by /reminders.
 * Run from packages/db: tsx scripts/verify-reminder-schema.ts --env local|staging|prod.
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { reminder, reminderTypeEnum } from '../src/schema/reminder';
import { resolveImporterTarget } from './lib/db-target';

async function main() {
  const target = resolveImporterTarget();
  const pool = new Pool(
    typeof target.connection === 'string'
      ? { connectionString: target.connection }
      : target.connection
  );
  try {
    const client = await pool.connect();
    let discardClient = false;
    try {
      await client.query('BEGIN READ ONLY');
      const db = drizzle(client, { casing: 'snake_case' });
      // Uses the application schema so missing columns also block deployment.
      await db.select().from(reminder).limit(0);
      const { rows } = await client.query<{ enumlabel: string }>(`
        SELECT e.enumlabel
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        JOIN pg_attribute a ON a.atttypid = t.oid
        WHERE n.nspname = 'public' AND t.typname = 'reminder_type'
          AND a.attrelid = 'public.reminder'::regclass AND a.attname = 'type'
      `);
      const labels = new Set(rows.map((row) => row.enumlabel));
      if (reminderTypeEnum.enumValues.some((label) => !labels.has(label))) {
        throw new Error('Required reminder_type values are missing.');
      }
      await client.query('COMMIT');
      console.log(
        `Verified reminder table, columns, and enum on ${target.env}.`
      );
    } catch (error) {
      discardClient = true;
      try {
        await client.query('ROLLBACK');
      } catch {
        // Preserve the original failure if the connection is already broken.
      }
      throw error;
    } finally {
      client.release(discardClient);
    }
  } finally {
    await pool.end();
  }
}

main().catch(() => {
  // Avoid exposing connection details from a production database error.
  console.error(
    'Reminder schema verification failed: check table, columns, and enum.'
  );
  process.exitCode = 1;
});
