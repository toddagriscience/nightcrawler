// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farmInfoInternalApplication } from '../db/schema';
import { createInsertSchema } from 'drizzle-zod';

export const farmInfoInternalApplicationInsertSchema = createInsertSchema(
  farmInfoInternalApplication
);
