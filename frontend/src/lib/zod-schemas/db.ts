// Copyright © Todd Agriscience, Inc. All rights reserved.

import { user } from '../db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const userSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);
