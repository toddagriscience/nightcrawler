// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * A farm user's contact details as the account pages render them. Every field
 * is a display string already resolved through the account formatting helpers,
 * so empty columns arrive as the `Not set` placeholder rather than `null`.
 *
 * This deliberately does not reuse the `user` schema row type: `name` holds the
 * user's full display name (`First Last`), which no single column holds.
 */
export interface AccountContact {
  /** The user's full name, e.g. `Alex Owner`, or `Not set`. */
  name: string;
  /** The user's email address, or `Not set`. */
  email: string;
  /** The user's phone number, or `Not set`. */
  phone: string;
}
