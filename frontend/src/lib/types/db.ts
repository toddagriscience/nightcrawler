// Copyright © Todd Agriscience, Inc. All rights reserved.

import { user } from '../db/schema';
import { type InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof user>;
