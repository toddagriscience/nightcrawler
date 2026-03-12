// Copyright © Todd Agriscience, Inc. All rights reserved.

// This is a separate export for server-side logic only
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: !process.env.NODE_TLS_REJECT_UNAUTHORIZED
      ? {
          ca: process.env.DATABASE_PEM_CERT!,
        }
      : null,
    max: 25,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { casing: 'snake_case' });
