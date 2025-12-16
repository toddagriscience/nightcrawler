// Copyright © Todd Agriscience, Inc. All rights reserved.

/** @fileoverview A collection of types relating to components -- generally props. */

/** A menu item for links.
 *
 * @property {string} href - The relative URL
 * @property {string} label - The label on the link itself
 */
export interface MenuItem {
  href: string;
  label: string;
}
