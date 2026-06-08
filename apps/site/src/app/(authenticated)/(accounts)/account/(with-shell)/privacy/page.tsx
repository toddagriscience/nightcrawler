// Copyright © Todd Agriscience, Inc. All rights reserved.

import { BiShieldSlash, BiChevronRight } from 'react-icons/bi';
import AccountInfo, {
  AccountInfoRow,
} from '../../components/account-info/account-info';

/**
 * Privacy settings page for account management.
 * Displays data sharing controls, personal data requests, and privacy policy access.
 */
export default function AccountPrivacyPage() {
  return (
    <AccountInfo
      title="Privacy"
      description="Manage how your data is used and control your privacy settings."
    >
      {/* Data Sharing Status */}
      <div className="border-b border-[var(--border-subtle)]">
        <AccountInfoRow
          label="Personal Information Sharing"
          rightContent={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--muted)]/10 px-3 py-1.5">
              <BiShieldSlash className="size-3.5 text-[var(--muted-foreground)]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Disabled
              </span>
            </span>
          }
        />
      </div>

      {/* Data Requests */}
      <div className="border-b border-[var(--border-subtle)]">
        <AccountInfoRow
          label="Request Personal Data"
          rightContent={
            <>
              <span className="text-sm text-[var(--foreground-secondary)]">
                Get a copy of your data
              </span>
              <BiChevronRight className="size-4 text-[var(--foreground-muted)]" />
            </>
          }
          href="/contact"
        />
        <AccountInfoRow
          label="Request Data Deletion"
          rightContent={
            <>
              <span className="text-sm text-[var(--foreground-secondary)]">
                Remove your account data
              </span>
              <BiChevronRight className="size-4 text-[var(--foreground-muted)]" />
            </>
          }
          href="/contact"
        />
      </div>

      {/* Legal */}
      <div>
        <AccountInfoRow
          label="Privacy Policy"
          rightContent={
            <>
              <span className="text-sm text-[var(--foreground-secondary)]">
                View our privacy practices
              </span>
              <BiChevronRight className="size-4 text-[var(--foreground-muted)]" />
            </>
          }
          href="/en/privacy"
        />
      </div>
    </AccountInfo>
  );
}
