// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Notable fields:
 *
 * @property {string} name - This is a honeypot field.
 * @property {boolean} isOrganic - If the farm isn't purely organic, this should be false. */
export interface ContactFormData {
  name?: string;
  firstName: string;
  lastName: string;
  farmName: string;
  email: string;
  phone: string;
  website?: string;
  isOrganic: boolean;
}
