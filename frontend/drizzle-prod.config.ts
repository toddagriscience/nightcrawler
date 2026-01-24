// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema/*',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    host: process.env.PROD_DATABASE_HOST!,
    port: Number(process.env.PROD_DATABASE_PORT!),
    user: process.env.PROD_DATABASE_USER,
    password: process.env.PROD_DATABASE_PASSWORD,
    database: process.env.PROD_DATABASE_DATABASE!,
    ssl: 'verify-full',
  },
});
