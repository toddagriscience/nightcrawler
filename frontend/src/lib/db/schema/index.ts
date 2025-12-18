// Copyright © Todd Agriscience, Inc. All rights reserved.

export { analysis } from './analysis';
export { client } from './client';
export { integratedManagementPlan } from './integratedManagementPlan';
export { managementZone } from './managementZone';
export { mineral } from './mineral';
export { oxidationRate } from './oxidationRate';
export { ph } from './ph';
export { solubility } from './solubility';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);
export { db };
