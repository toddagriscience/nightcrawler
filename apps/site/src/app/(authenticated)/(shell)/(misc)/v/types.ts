// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Request availability for a variety (mirrors the seed_variety_status enum). */
export type VarietyStatus = 'available' | 'back_order' | 'reference';

/** A single variety as shown on the browse page. */
export interface BrowseVariety {
  /** seed_variety id */
  id: number;
  /** Variety/cultivar name */
  name: string;
  /** URL-safe slug used for /v/[slug] */
  slug: string;
  /** Variety description (may be empty) */
  description: string | null;
  /** Request availability */
  status: VarietyStatus;
  /** Display-only price per ounce, in cents */
  pricePerOzCents: number | null;
  /** Display-only price per pound, in cents */
  pricePerLbCents: number | null;
  /** Display-only price per plant, in cents */
  pricePerPlantCents: number | null;
  /** Parent crop-group name */
  cropName: string;
}

/** Varieties grouped under their parent crop, for the list layout. */
export interface BrowseCropGroup {
  /** Crop-group name */
  cropName: string;
  /** Varieties belonging to this crop */
  varieties: BrowseVariety[];
}
