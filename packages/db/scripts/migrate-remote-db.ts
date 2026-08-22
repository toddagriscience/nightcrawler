// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Applies the committed drizzle migrations to staging or prod using the
 * ledger-based drizzle-orm migrator (the same mechanism as
 * migrate-local-db.ts). This replaces `drizzle-kit push` in CI, whose
 * interactive enum resolver aborts in a TTY-less runner while still exiting 0
 * — the silent no-op that let prod drift behind main.
 *
 * Usage: tsx scripts/migrate-remote-db.ts --env staging|prod
 * (run from packages/db; requires STAGING_DATABASE_* / PROD_DATABASE_* and
 * the CA cert env vars — see scripts/lib/db-target.ts)
 */

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { getArg } from './lib/importer-lib';
import { resolveRemoteDbConfig } from './lib/db-target';

async function main() {
  const env = getArg('env');
  if (env !== 'staging' && env !== 'prod') {
    throw new Error(
      'Usage: tsx scripts/migrate-remote-db.ts --env staging|prod'
    );
  }

  // No CREATE EXTENSION here (unlike migrate-local-db.ts): staging/prod
  // already have vector + citext, and the CI role may lack the privilege.
  const pool = new Pool(resolveRemoteDbConfig(env));
  try {
    const db = drizzle(pool, { casing: 'snake_case' });
    await migrate(db, { migrationsFolder: 'drizzle' });

    // Belt and braces: the ledger must now cover every committed migration.
    // A mismatch means something applied fewer migrations than the journal
    // claims — fail loudly instead of letting the schema drift silently.
    const journal = JSON.parse(
      readFileSync('drizzle/meta/_journal.json', 'utf8')
    ) as { entries: unknown[] };
    const { rows } = await pool.query<{ count: number }>(
      'select count(*)::int as count from drizzle.__drizzle_migrations'
    );
    const ledgerCount = rows[0].count;
    if (ledgerCount !== journal.entries.length) {
      throw new Error(
        `Ledger on ${env} has ${ledgerCount} entries but the committed ` +
          `journal has ${journal.entries.length} — schema and ledger disagree.`
      );
    }
    console.log(
      `Migrated ${env}: ledger at ${ledgerCount}/${journal.entries.length} entries.`
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Remote migration failed:', error);
  process.exit(1);
});
