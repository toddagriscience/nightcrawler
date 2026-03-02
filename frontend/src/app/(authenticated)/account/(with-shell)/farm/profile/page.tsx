// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../../components/account-info/account-info';
import { db } from '@/lib/db/schema/connection';
import {
  farm,
  farmCertificate,
  farmInfoInternalApplication,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { toDisplayDate, toDisplayValue } from '../../../util';
import { toCertificationValue } from './utils';

export default async function FarmProfilePage() {
  const currentUser = await getAuthenticatedInfo();
  const farmId = currentUser.farmId;

  if (!farmId) {
    return (
      <AccountInfo
        title="Farm profile"
        description="Edit farm profile details."
      >
        <p className="text-sm text-[#ff4d00]">
          User is not associated with a farm.
        </p>
      </AccountInfo>
    );
  }

  const [farmRecord] = await db
    .select({
      managementStartDate: farm.managementStartDate,
    })
    .from(farm)
    .where(eq(farm.id, farmId))
    .limit(1);

  const [certificateRecord] = await db
    .select()
    .from(farmCertificate)
    .where(eq(farmCertificate.farmId, farmId))
    .limit(1);

  const [applicationRecord] = await db
    .select({
      mainCrops: farmInfoInternalApplication.mainCrops,
      totalAcreage: farmInfoInternalApplication.totalAcreage,
      supplierContracts: farmInfoInternalApplication.supplierContracts,
    })
    .from(farmInfoInternalApplication)
    .where(eq(farmInfoInternalApplication.farmId, farmId))
    .limit(1);

  return (
    <AccountInfo title="Farm profile">
      <AccountInfoSection title="Overview">
        <AccountInfoRow
          label="Management date"
          value={toDisplayDate(farmRecord?.managementStartDate)}
        />
        <AccountInfoRow
          label="Highest demand produce"
          value={toDisplayValue(applicationRecord?.mainCrops)}
        />
        <AccountInfoRow
          label="Total acreage"
          value={
            applicationRecord?.totalAcreage == null
              ? 'Not set'
              : String(applicationRecord.totalAcreage)
          }
        />
        <AccountInfoRow
          label="Supplier contracts"
          value={toDisplayValue(applicationRecord?.supplierContracts)}
        />
      </AccountInfoSection>

      <AccountInfoSection title="Certifications">
        <AccountInfoRow
          label="GAP"
          value={toCertificationValue(
            certificateRecord?.hasGAP,
            certificateRecord?.GAPDate
          )}
        />
        <AccountInfoRow
          label="Local"
          value={toCertificationValue(
            certificateRecord?.hasLocalInspection,
            certificateRecord?.localInspectionDate
          )}
        />
        <AccountInfoRow
          label="Organic"
          value={toCertificationValue(
            certificateRecord?.hasOrganic,
            certificateRecord?.organicDate
          )}
        />
        <AccountInfoRow
          label="Biodynamic"
          value={toCertificationValue(
            certificateRecord?.hasBiodynamic,
            certificateRecord?.biodynamicDate
          )}
        />
        <AccountInfoRow
          label="Regenerative Organic"
          value={toCertificationValue(
            certificateRecord?.hasRegenerativeOrganic,
            certificateRecord?.regenerativeOrganic
          )}
        />
      </AccountInfoSection>
    </AccountInfo>
  );
}
