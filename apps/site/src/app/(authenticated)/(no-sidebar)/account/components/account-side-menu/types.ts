// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Props for the account side menu. Today's caller normalises every value
 * through the account display helpers, so a missing field arrives as the
 * `NOT_SET` sentinel (`'Not set'`) rather than an empty string or `null` — but
 * the props are plain strings, so the component validates the contact values
 * itself before linkifying them.
 */
export interface AccountSideMenuProps {
  /** Display name for the farm; heads the side menu region as an `<h2>`. */
  farmName: string;

  /** Display name for the farm's primary contact. */
  contactName: string;

  /** Email address for the farm's primary contact. */
  contactEmail: string;

  /**
   * Phone number for the farm's primary contact, exactly as stored (E.164,
   * e.g. `+15551234567`) — the display helpers do not reformat it.
   */
  contactPhone: string;
}
