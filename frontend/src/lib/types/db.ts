// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farmInfoInternalApplication } from '../db/schema';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export type FarmInfoInternalApplication = InferSelectModel<
  typeof farmInfoInternalApplication
>;

export type FarmInfoInternalApplicationInsert = InferInsertModel<
  typeof farmInfoInternalApplication
>;
