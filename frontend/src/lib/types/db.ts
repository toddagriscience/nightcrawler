// Copyright © Todd Agriscience, Inc. All rights reserved.

import { InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import {
  farmInfoInternalApplication,
  user,
  farm,
  farmCertificate,
  farmLocation,
  tab,
  managementZone,
  widget,
} from '../db/schema';

export type UserSelect = InferSelectModel<typeof user>;
export type FarmLocationSelect = InferSelectModel<typeof farmLocation>;
export type FarmSelect = InferSelectModel<typeof farm>;
export type FarmCertificateSelect = InferSelectModel<typeof farmCertificate>;
export type FarmInfoInternalApplicationSelect = InferSelectModel<
  typeof farmInfoInternalApplication
>;
export type TabSelect = InferSelectModel<typeof tab>;
export type ManagementZoneSelect = InferSelectModel<typeof managementZone>;
export type WidgetSelect = InferSelectModel<typeof widget>;

export type FarmInsert = InferInsertModel<typeof farm>;
export type FarmLocationInsert = InferInsertModel<typeof farmLocation>;
export type FarmCertificateInsert = InferInsertModel<typeof farmCertificate>;
export type UserInsert = InferInsertModel<typeof user>;
export type FarmInfoInternalApplicationInsert = InferInsertModel<
  typeof farmInfoInternalApplication
>;
