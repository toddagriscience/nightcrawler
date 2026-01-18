// Copyright © Todd Agriscience, Inc. All rights reserved.

import { user } from '../db/schema';
import { createInsertSchema } from 'drizzle-zod';

export const userInsertSchema = createInsertSchema(user);
