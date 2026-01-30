// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { urlFor } from '@/lib/sanity/utils';
import { type SanityImageSource } from '@sanity/image-url';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

type SanityImageWithAlt = SanityImageSource & { alt?: string };

interface SanityHeaderImageProps {
  headerImage?: SanityImageWithAlt | null;
  src?: string;
  alt?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
}

/**
 * SanityHeaderImage component for displaying a article header image
 * @returns {JSX.Element} - The article header image component from Sanity
 */
export default function SanityHeaderImage({
  headerImage,
  src,
  alt,
  wrapperClassName = '',
  imageClassName = '',
  overlayClassName = '',
}: SanityHeaderImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Start at -40% to hide top, then move further for parallax
  const y = useTransform(scrollYProgress, [-0.5, 1], ['-40%', '20%']);
  const imageSource =
    headerImage && typeof headerImage === 'object' && 'asset' in headerImage
      ? headerImage.asset
      : headerImage;
  const imageUrl = imageSource
    ? urlFor(imageSource as SanityImageSource)?.url()
    : undefined;
  const resolvedImageUrl = src ?? imageUrl;
  const resolvedAlt = alt ?? headerImage?.alt ?? '';

  if (!resolvedImageUrl) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`relative xl:h-[700px] lg:h-[600px] md:h-[490px] sm:h-[455px] h-[350px] overflow-hidden ${wrapperClassName}`.trim()}
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={resolvedImageUrl}
          alt={resolvedAlt}
          fill
          sizes="100vw"
          className={`object-cover ${imageClassName}`.trim() + ' rounded-sm'}
        />
        {overlayClassName ? (
          <div
            className={`pointer-events-none absolute inset-0 ${overlayClassName}`.trim()}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
