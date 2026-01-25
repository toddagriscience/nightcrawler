// Copyright © Todd Agriscience, Inc. All rights reserved.

// This is a separate export for server-side logic only
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { ca: process.env.PROD_DATABASE_PEM_CERT!, rejectUnauthorized: false },
});

export const db = drizzle(client, { casing: 'snake_case' });
