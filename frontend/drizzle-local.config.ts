// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema/*',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    host: process.env.LOCAL_DATABASE_HOST!,
    port: Number(process.env.LOCAL_DATABASE_PORT!),
    user: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_DATABASE!,
    ssl: Boolean(process.env.LOCAL_DATABASE_SSL),
  },
});
