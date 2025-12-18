// Copyright © Todd Agriscience, Inc. All rights reserved.

import { analysis } from './schema/analysis';
import { client } from './schema/client';
import { integratedManagementPlan } from './schema/integratedManagementPlan';
import { managementZone } from './schema/managementZone';
import { mineral } from './schema/mineral';
import { oxidationRate } from './schema/oxidationRate';
import { ph } from './schema/ph';
import { solubility } from './schema/solubility';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);

export {
  analysis,
  client,
  integratedManagementPlan,
  managementZone,
  mineral,
  oxidationRate,
  ph,
  solubility,
};

export default db;
