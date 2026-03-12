// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function migrateLocalDb() {
  const db = drizzle(process.env.DATABASE_URL!, { casing: 'snake_case' });

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS citext`);
  await migrate(db, { migrationsFolder: 'drizzle' });
}

migrateLocalDb().catch((error) => {
  console.error('Failed to migrate local DB:', error);
  process.exit(1);
});
