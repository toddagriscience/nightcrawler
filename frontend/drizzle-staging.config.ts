// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema/*',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    host: process.env.STAGING_DATABASE_HOST!,
    port: Number(process.env.STAGING_DATABASE_PORT!),
    user: process.env.STAGING_DATABASE_USER,
    password: process.env.STAGING_DATABASE_PASSWORD,
    database: process.env.STAGING_DATABASE_DATABASE!,
    ssl: {
      ca: process.env.STAGING_DATABASE_PEM_CERT!,
      rejectUnauthorized: false,
    },
  },
});
