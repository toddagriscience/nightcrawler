// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  farm,
  farmCertificate,
  farmLocation,
  user,
  farmInfoInternalApplication,
} from '../db/schema/';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const userInsertSchema = createInsertSchema(user);
export const farmInfoInternalApplicationInsertSchema = createInsertSchema(
  farmInfoInternalApplication
);
export const farmLocationInsertSchema = createInsertSchema(farmLocation);
export const farmCertificateInsertSchema = createInsertSchema(farmCertificate);
export const farmInsertSchema = createInsertSchema(farm);

export const farmLocationSelectSchema = createSelectSchema(farmLocation);
export const farmCertificateSelectSchema = createSelectSchema(farmCertificate);
export const farmSelectSchema = createSelectSchema(farm);

export const farmLocationUpdateSchema = createUpdateSchema(farmLocation);
export const farmCertificateUpdateSchema = createUpdateSchema(farmCertificate);
export const farmUpdateSchema = createUpdateSchema(farm);
