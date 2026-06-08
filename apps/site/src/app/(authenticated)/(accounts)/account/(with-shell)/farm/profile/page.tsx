// Copyright © Todd Agriscience, Inc. All rights reserved.

import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from '../../../components/account-info/account-info';
import { db } from '@nightcrawler/db/schema/connection';
import {
  farm,
  farmCertificate,
  farmInfoInternalApplication,
} from '@nightcrawler/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { toDisplayDate, toDisplayValue } from '../../../util';
import { toCertificationValue } from './utils';

/**
 * Certification badge component for displaying certified status
 * with appropriate styling based on certification state.
 */
function CertificationBadge({
  label,
  isCertified,
  date,
}: {
  label: string;
  isCertified: boolean;
  date?: string | null;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-[var(--foreground-muted)] w-32 shrink-0">
        {label}
      </span>
      {isCertified ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--zone-active)]/10 text-[var(--zone-active)] text-xs font-medium">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Certified
          </span>
          {date && (
            <span className="text-xs text-[var(--foreground-secondary)]">
              {date}
            </span>
          )}
        </div>
      ) : (
        <span className="text-xs text-[var(--foreground-muted)]/60 uppercase tracking-wider">
          Not certified
        </span>
      )}
    </div>
  );
}

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
        <div className="space-y-1">
          <CertificationBadge
            label="GAP"
            isCertified={certificateRecord?.hasGAP ?? false}
            date={toCertificationValue(
              certificateRecord?.hasGAP,
              certificateRecord?.GAPDate
            ).replace('Yes, ', '')}
          />
          <CertificationBadge
            label="Local"
            isCertified={certificateRecord?.hasLocalInspection ?? false}
            date={toCertificationValue(
              certificateRecord?.hasLocalInspection,
              certificateRecord?.localInspectionDate
            ).replace('Yes, ', '')}
          />
          <CertificationBadge
            label="Organic"
            isCertified={certificateRecord?.hasOrganic ?? false}
            date={toCertificationValue(
              certificateRecord?.hasOrganic,
              certificateRecord?.organicDate
            ).replace('Yes, ', '')}
          />
          <CertificationBadge
            label="Biodynamic"
            isCertified={certificateRecord?.hasBiodynamic ?? false}
            date={toCertificationValue(
              certificateRecord?.hasBiodynamic,
              certificateRecord?.biodynamicDate
            ).replace('Yes, ', '')}
          />
          <CertificationBadge
            label="Regenerative Organic"
            isCertified={certificateRecord?.hasRegenerativeOrganic ?? false}
            date={toCertificationValue(
              certificateRecord?.hasRegenerativeOrganic,
              certificateRecord?.regenerativeOrganic
            ).replace('Yes, ', '')}
          />
        </div>
      </AccountInfoSection>
    </AccountInfo>
  );
}
