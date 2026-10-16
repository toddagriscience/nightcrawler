// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Request availability for a variety (mirrors the seed_variety_status enum). */
export type PublicVarietyStatus = 'available' | 'back_order' | 'reference';

/** A single variety as shown on the public variety list page. */
export interface PublicVariety {
  /** seed_variety id */
  id: number;
  /** Variety/cultivar name */
  name: string;
  /** Variety description (may be empty) */
  description: string | null;
  /** Request availability, used for the availability filter */
  status: PublicVarietyStatus;
  /** Parent crop-group name, used for the crop filter */
  cropName: string;
}
