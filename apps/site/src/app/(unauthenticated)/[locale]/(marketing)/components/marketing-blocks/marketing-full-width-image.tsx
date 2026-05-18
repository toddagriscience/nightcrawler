// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';

/** Wide landscape band */
export interface MarketingFullWidthImageProps {
  /** Public path under `/public` */
  src: string;
  alt: string;
  /** Optional ratio class when the asset is not pre-sized */
  className?: string;
  /** Pixel width passed to `next/image` when {@link aspectClassName} is omitted */
  width?: number;
  height?: number;
  /**
   * When set, the figure gets `relative` + this class and the image uses `fill` with
   * `object-cover`. Use a slightly shorter ratio than the asset (e.g. `aspect-[16/8.75]`
   * for a 16:9 photo) to crop a thin strip; pair with {@link imageClassName} for
   * `object-position`.
   */
  aspectClassName?: string;
  /** Extra classes on the `Image` (e.g. `object-[center_44%]` to trim a bit from the top) */
  imageClassName?: string;
}

/**
 * Full-bleed marketing photo (regular layout rhythm).
 *
 * @param props - Image source and dimensions
 * @param props.aspectClassName - Optional `aspect-*` box so `object-cover` can crop
 * @param props.imageClassName - Optional `object-position` / other `Image` utilities
 */
export function MarketingFullWidthImage({
  src,
  alt,
  className = '',
  width = 1600,
  height = 900,
  aspectClassName,
  imageClassName = '',
}: MarketingFullWidthImageProps) {
  const figureBase =
    'mx-auto w-full max-w-[1200px] overflow-hidden px-4 md:px-6';
  const sizes = '(max-width: 768px) 100vw, 1200px';

  if (aspectClassName !== undefined && aspectClassName.length > 0) {
    return (
      <figure
        className={`relative ${figureBase} ${aspectClassName} ${className}`.trim()}
      >
        <Image
          alt={alt}
          className={`object-cover ${imageClassName}`.trim()}
          fill
          sizes={sizes}
          src={src}
        />
      </figure>
    );
  }

  return (
    <figure className={`${figureBase} ${className}`.trim()}>
      <Image
        alt={alt}
        className={`h-auto w-full object-cover ${imageClassName}`.trim()}
        height={height}
        priority={false}
        sizes={sizes}
        src={src}
        width={width}
      />
    </figure>
  );
}
