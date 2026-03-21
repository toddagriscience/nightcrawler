// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  farmCertificateInsertSchema,
  farmCertificateSelectSchema,
  farmCertificateUpdateSchema,
  farmInsertSchema,
  farmLocationInsertSchema,
  farmLocationSelectSchema,
  farmLocationUpdateSchema,
  farmSelectSchema,
  farmUpdateSchema,
} from '@/lib/zod-schemas/db';
import z from 'zod';

export const generalBusinessInformationInsertSchema = z
  .intersection(
    farmLocationInsertSchema,
    z.intersection(farmCertificateInsertSchema, farmInsertSchema)
  )
  .and(
    z.object({
      hasAddress: z.enum(['yes', 'no'], {
        message: 'Please select Yes or No.',
      }),
    })
  )
  .superRefine((data, ctx) => {
    const anyChecked = [
      data.hasGAP,
      data.hasLocalInspection,
      data.hasOrganic,
      data.hasBiodynamic,
      data.hasRegenerativeOrganic,
      data.hasNone,
    ].some(Boolean);

    if (!anyChecked) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select at least one certification.',
        path: ['certifications'],
      });
    }

    if (data.hasAddress === 'yes') {
      (['address1', 'state', 'postalCode', 'country'] as const).forEach(
        (key) => {
          if (!data[key]?.trim()) {
            ctx.addIssue({
              code: 'custom',
              message: 'This field is required.',
              path: [key],
            });
          }
        }
      );
    }

    if (data.hasAddress === 'no') {
      (['countyState', 'apn'] as const).forEach((key) => {
        if (!data[key]?.trim()) {
          ctx.addIssue({
            code: 'custom',
            message: 'This field is required.',
            path: [key],
          });
        }
      });
    }
  });

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

export type TabTypes =
  | 'general'
  | 'colleagues'
  | 'farm'
  | 'subscription'
  | 'terms';

export type VerificationStatus = { email: string; verified: boolean };
