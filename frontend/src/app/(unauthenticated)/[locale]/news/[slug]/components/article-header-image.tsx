// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useRef } from 'react';

/**
 * ArticleHeaderImage component for displaying a article header image
 * @returns {JSX.Element} - The article header image component
 */
export default function ArticleHeaderImage({
  src,
  alt,
  wrapperClassName = '',
  imageClassName = '',
  overlayClassName = '',
}: {
  src: StaticImageData | string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Start at -40% to hide top, then move further for parallax
  const y = useTransform(scrollYProgress, [-0.5, 1], ['-40%', '20%']);

  return (
    <div
      ref={ref}
      className={`relative mx-6 lg:px-0 mt-6 xl:h-[700px] lg:h-[600px] md:h-[490px] sm:h-[455px] h-[350px] overflow-hidden ${wrapperClassName}`.trim()}
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
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
