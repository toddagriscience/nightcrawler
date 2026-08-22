// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Props for the account side menu. Every value is already normalised by the
 * account display helpers, so a missing field arrives as the `NOT_SET`
 * sentinel (`'Not set'`) rather than an empty string or `null`.
 */
export interface AccountSideMenuProps {
  /** Display name for the farm, rendered as the account shell's heading. */
  farmName: string;

  /** Display name for the farm's primary contact. */
  contactName: string;

  /** Email address for the farm's primary contact. */
  contactEmail: string;

  /** Phone number for the farm's primary contact, in display formatting. */
  contactPhone: string;
}
