// Copyright © Todd Agriscience, Inc. All rights reserved.

import { InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { farm, farmCertificate, farmLocation } from '../db/schema/farm';
import { user } from '../db/schema/user';
import { farmInfoInternalApplication } from '../db/schema';

export type User = InferSelectModel<typeof user>;
export type FarmLocation = InferSelectModel<typeof farmLocation>;
export type Farm = InferSelectModel<typeof farm>;
export type FarmCertificate = InferSelectModel<typeof farmCertificate>;
export type FarmInfoInternalApplicationSelect = InferSelectModel<
  typeof farmInfoInternalApplication
>;

export type FarmInsert = InferInsertModel<typeof farm>;
export type FarmLocationInsert = InferInsertModel<typeof farmLocation>;
export type FarmCertificateInsert = InferInsertModel<typeof farmCertificate>;
export type UserInsert = InferInsertModel<typeof user>;
export type FarmInfoInternalApplicationInsert = InferInsertModel<
  typeof farmInfoInternalApplication
>;
