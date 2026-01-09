// Copyright © Todd Agriscience, Inc. All rights reserved.

export { analysis } from './analysis';
export { integratedManagementPlan } from './integratedManagementPlan';
export { managementZone } from './managementZone';
export { mineral } from './mineral';
export { oxidationRate } from './oxidationRate';
export { ph } from './ph';
export { solubility } from './solubility';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
export { farm } from './farm';
export { user, userTacAcceptance, userRoleEnum } from './user';

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});
export { db };
