// Copyright © Todd Agriscience, Inc. All rights reserved.

import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';

export { analysis } from './analysis';
export { integratedManagementPlan } from './integrated-management-plan';
export { managementZone } from './management-zone';
export { mineral } from './mineral';
export { oxidationRate } from './oxidation-rate';
export { ph } from './ph';
export { solubility } from './solubility';
export { farm, farmCertificate, farmLocation } from './farm';
export { user, userTacAcceptance, userRoleEnum } from './user';
export {
  farmApplicationFarmInfo,
  farmApplicationActivities,
} from './internal-application';

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});
export { db };
