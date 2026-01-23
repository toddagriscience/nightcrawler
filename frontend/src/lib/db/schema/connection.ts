// Copyright © Todd Agriscience, Inc. All rights reserved.

// This is a separate export for server-side logic only
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});
