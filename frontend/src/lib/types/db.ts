// Copyright © Todd Agriscience, Inc. All rights reserved.

// Import directly from schema files to avoid pulling in the database connection
// (which uses Node.js modules that can't be bundled for client components)
import { farm, farmCertificate, farmLocation, certificateType } from '../db/schema/farm';
import { user } from '../db/schema/user';
import { InferInsertModel, type InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof user>;
export type FarmLocation = InferSelectModel<typeof farmLocation>;
export type Farm = InferSelectModel<typeof farm>;
export type FarmCertificate = InferSelectModel<typeof farmCertificate>;

export type FarmInsert = InferInsertModel<typeof farm>;
export type FarmLocationInsert = InferInsertModel<typeof farmLocation>;
export type FarmCertificateInsert = InferInsertModel<typeof farmCertificate>;

export const certificateTypes = certificateType.enumValues;
