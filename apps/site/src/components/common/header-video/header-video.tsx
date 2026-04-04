// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

import { useRef } from 'react';

/**
 * HeaderVideo component for displaying a header video on pages
 * @returns {JSX.Element} - The header video component
 */
export default function HeaderVideo({
  src,
  alt,
  wrapperClassName = '',
  videoClassName = '',
  overlayClassName = '',
}: {
  src: string;
  alt: string;
  wrapperClassName?: string;
  videoClassName?: string;
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
      className={`relative mx-6 mt-6 lg:h-[750px] md:h-[595px] h-[495px] overflow-hidden ${wrapperClassName}`.trim()}
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          src={src}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          className={`object-cover ${videoClassName}`.trim() + ' rounded-sm'}
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
