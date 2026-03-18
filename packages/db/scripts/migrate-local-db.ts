// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const localDatabaseUrl =
  process.env.LOCAL_DATABASE_HOST &&
  process.env.LOCAL_DATABASE_PORT &&
  process.env.LOCAL_DATABASE_USER &&
  process.env.LOCAL_DATABASE_DATABASE
    ? `postgresql://${encodeURIComponent(process.env.LOCAL_DATABASE_USER)}:${encodeURIComponent(process.env.LOCAL_DATABASE_PASSWORD ?? '')}@${process.env.LOCAL_DATABASE_HOST}:${process.env.LOCAL_DATABASE_PORT}/${process.env.LOCAL_DATABASE_DATABASE}`
    : process.env.DATABASE_URL;

async function migrateLocalDb() {
  if (!localDatabaseUrl) {
    throw new Error(
      'Local database configuration is missing. Set LOCAL_DATABASE_* or DATABASE_URL.'
    );
  }

  const db = drizzle(localDatabaseUrl, { casing: 'snake_case' });

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS citext`);
  await migrate(db, { migrationsFolder: 'drizzle' });
}

migrateLocalDb().catch((error) => {
  console.error('Failed to migrate local DB:', error);
  process.exit(1);
});
