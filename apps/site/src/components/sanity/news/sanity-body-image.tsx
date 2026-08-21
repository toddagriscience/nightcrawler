// Copyright © Todd Agriscience, Inc. All rights reserved.

import { logger } from '@/lib/logger';
import { urlFor } from '@/lib/sanity/utils';
import type { SanityImageObject } from '@sanity/image-url';
import type { PortableTextTypeComponentProps } from 'next-sanity';
import Image from 'next/image';

/**
 * Inline `image` block stored in the shared article Portable Text schema
 * (`articlePortableContentOf` in `apps/sanity/schemaTypes/article-shared-fields.ts`).
 */
export interface SanityBodyImageValue extends Partial<SanityImageObject> {
  /** Alt text; required by the CMS schema, defaulted to decorative when absent. */
  alt?: string;
}

/** Article body column width in CSS pixels; mirrors the `max-w-[685px]` body wrapper. */
const BODY_COLUMN_WIDTH = 685;

/**
 * Trailing `-<width>x<height>-<format>` segment of a Sanity image asset id
 * (`image-<hash>-2016x1342-png`), the only place intrinsic dimensions are
 * available without an extra `asset->metadata` projection.
 */
const ASSET_DIMENSIONS_PATTERN = /-(\d+)x(\d+)-[^-]+$/;

/**
 * Renders an image embedded in an article body. Registered as the
 * `components.types.image` renderer for every Portable Text body built from the
 * shared article schema; without it Portable Text falls back to its hidden
 * "Unknown block type" placeholder and the image silently disappears.
 *
 * Intrinsic dimensions come from the asset id so the reserved box matches the
 * real aspect ratio and the image contributes no layout shift.
 *
 * @param props.value - Sanity `image` block from the article `content` array
 */
export default function SanityBodyImage({
  value,
}: PortableTextTypeComponentProps<SanityBodyImageValue>) {
  const { alt, asset, crop, hotspot } = value;

  if (asset === undefined) {
    logger.warn('Skipping article body image: block has no asset reference');
    return null;
  }

  const assetId = '_ref' in asset ? asset._ref : asset._id;
  const dimensions = ASSET_DIMENSIONS_PATTERN.exec(assetId);

  if (dimensions === null) {
    logger.warn('Skipping article body image: asset id encodes no dimensions', {
      assetId,
    });
    return null;
  }

  return (
    <figure className="my-6 w-full">
      <Image
        src={urlFor({ asset, crop, hotspot })
          .width(BODY_COLUMN_WIDTH * 2)
          .fit('max')
          .auto('format')
          .url()}
        alt={alt ?? ''}
        width={Number(dimensions[1])}
        height={Number(dimensions[2])}
        sizes={`(max-width: ${BODY_COLUMN_WIDTH}px) 100vw, ${BODY_COLUMN_WIDTH}px`}
        className="h-auto w-full rounded-sm"
      />
    </figure>
  );
}
