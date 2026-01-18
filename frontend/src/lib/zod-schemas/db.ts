// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farmInfoInternalApplication, user } from '../db/schema';
import { createInsertSchema } from 'drizzle-zod';

export const farmInfoInternalApplicationInsertSchema = createInsertSchema(
  farmInfoInternalApplication
);

export const userInsertSchema = createInsertSchema(user);
