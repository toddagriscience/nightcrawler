// Copyright © Todd Agriscience, Inc. All rights reserved.

import z from 'zod';
import {
  farmInsertSchema,
  farmCertificateInsertSchema,
  farmLocationInsertSchema,
  farmCertificateSelectSchema,
  farmLocationSelectSchema,
  farmSelectSchema,
  farmCertificateUpdateSchema,
  farmLocationUpdateSchema,
  farmUpdateSchema,
} from '@/lib/zod-schemas/db';

export const generalBusinessInformationInsertSchema = z.intersection(
  farmLocationInsertSchema,
  z.intersection(farmCertificateInsertSchema, farmInsertSchema)
);

export const generalBusinessInformationSelectSchema = z.intersection(
  farmLocationSelectSchema,
  z.intersection(farmCertificateSelectSchema, farmSelectSchema)
);

export const generalBusinessInformationUpdateSchema = z.intersection(
  farmLocationUpdateSchema,
  z.intersection(farmCertificateUpdateSchema, farmUpdateSchema)
);

export type GeneralBusinessInformationInsert = z.infer<
  typeof generalBusinessInformationInsertSchema
>;

export type GeneralBusinessInformationSelect = z.infer<
  typeof generalBusinessInformationSelectSchema
>;

export type GeneralBusinessInformationUpdate = z.infer<
  typeof generalBusinessInformationUpdateSchema
>;

export type TabTypes = 'general' | 'colleagues' | 'farm' | 'terms';

export type VerificationStatus = { email: string; verified: boolean };
