// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { urlFor } from '@/lib/sanity/utils';
import { type SanityImageSource } from '@sanity/image-url';
import Image from 'next/image';

type SanityImageWithAlt = SanityImageSource & { alt?: string };

interface SanityProfileImageProps {
  profileImage?: SanityImageWithAlt | null;
  src?: string;
  alt?: string;
  className?: string;
}

/**
 * Renders a governance profile headshot image from Sanity.
 *
 * @param {SanityProfileImageProps} props - Image data and optional overrides.
 * @returns {JSX.Element | null} - The profile image, or null if missing.
 */
export default function SanityImage({
  profileImage,
  src,
  alt,
  className,
}: SanityProfileImageProps) {
  const imageSource =
    profileImage && typeof profileImage === 'object' && 'asset' in profileImage
      ? profileImage.asset
      : profileImage;
  const imageUrl = imageSource
    ? urlFor(imageSource as SanityImageSource)?.url()
    : undefined;
  const resolvedImageUrl = src ?? imageUrl;
  const resolvedAlt = alt ?? profileImage?.alt ?? '';

  if (!resolvedImageUrl) {
    return null;
  }

  return (
    <div
      className={`relative lg:h-[600px] md:h-[600px] sm:h-[455px] h-[350px] ${className ?? ''}`.trim()}
    >
      <Image
        src={resolvedImageUrl}
        alt={resolvedAlt}
        fill
        sizes="100vw"
        className="object-contain rounded-sm"
      />
    </div>
  );
}
