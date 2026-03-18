// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

async function wipeLocalDb() {
  const db = drizzle(process.env.DATABASE_URL!, { casing: 'snake_case' });

  await db.execute(sql.raw('DROP SCHEMA IF EXISTS public CASCADE'));
  await db.execute(sql.raw('DROP SCHEMA IF EXISTS drizzle CASCADE'));
  await db.execute(sql.raw('CREATE SCHEMA public'));
  console.log('Local database reset');
}

wipeLocalDb().catch((error) => {
  console.error('Failed to wipe local DB:', error);
  process.exit(1);
});
