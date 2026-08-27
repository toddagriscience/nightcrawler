// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useRef } from 'react';

const FRAME_CLASSES = 'mx-auto w-[95%] lg:max-w-[1124px]';
const FRAME_HEIGHT =
  '[--frame-h:495px] md:[--frame-h:595px] lg:[--frame-h:630px]';
const PARALLAX_PROGRESS: [number, number] = [-0.5, 1];
const PARALLAX_PERCENT: [number, number] = [-40, 20];

// Follows the photo's bottom edge up when the parallax lifts it off the bottom
// of the frame, and holds still once the frame clips it flush.
const CAPTION_TRACKING =
  'translate-y-[calc(min(0,var(--caption-shift,-20))*var(--frame-h)/100)]';

/**
 * HeaderImg component for displaying a header image on pages
 *
 * When provided, `caption` renders a visible credit under the image, tied to it
 * with a `figure`. Describe the photo in `alt` and keep the caption for context,
 * so a screen reader does not hear the same thing twice.
 * @returns {JSX.Element} - The header image component
 */
export default function HeaderImg({
  src,
  alt,
  caption,
  wrapperClassName = '',
  imageClassName = '',
  overlayClassName = '',
}: {
  src: StaticImageData | string;
  alt: string;
  caption?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Start at -40% to hide top, then move further for parallax
  const y = useTransform(scrollYProgress, PARALLAX_PROGRESS, [
    `${PARALLAX_PERCENT[0]}%`,
    `${PARALLAX_PERCENT[1]}%`,
  ]);

  // The same offset as a bare number, for the caption to convert into pixels.
  const layerPercent = useTransform(
    scrollYProgress,
    PARALLAX_PROGRESS,
    PARALLAX_PERCENT
  );

  useMotionValueEvent(layerPercent, 'change', (value) => {
    captionRef.current?.style.setProperty('--caption-shift', String(value));
  });

  // The box clips the parallax, so the caption cannot live inside it.
  const boxClassName = (
    caption === undefined
      ? `relative mx-6 mt-6 ${FRAME_CLASSES} lg:h-[630px] md:h-[595px] h-[495px] overflow-hidden ${wrapperClassName}`
      : `relative mt-6 w-full h-[var(--frame-h)] overflow-hidden ${wrapperClassName}`
  ).trim();

  const box = (
    <div ref={ref} className={boxClassName}>
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          loading="eager"
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

  if (caption === undefined) {
    return box;
  }

  return (
    <figure className={`${FRAME_CLASSES} ${FRAME_HEIGHT}`}>
      {box}
      <figcaption
        ref={captionRef}
        className={`mt-3 text-left text-sm text-foreground/70 ${CAPTION_TRACKING}`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
