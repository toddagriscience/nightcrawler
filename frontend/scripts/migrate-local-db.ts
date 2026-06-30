// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function migrateLocalDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  });

  const db = drizzle(pool, { casing: 'snake_case' });

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS citext`);
  await migrate(db, { migrationsFolder: 'drizzle' });

  await pool.end();
}

migrateLocalDb().catch((error) => {
  console.error('Failed to migrate local DB:', error);
  process.exit(1);
});
