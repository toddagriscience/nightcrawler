// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';

import { MarketingPillLink } from './marketing-pill-link';

/** Image + copy row; image flips side on `md+` */
export interface MarketingImageTextSplitProps {
  sectionId?: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Desktop image column order */
  imageSide: 'left' | 'right';
  heading: string;
  headingId?: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Alternating marketing band: portrait-friendly image beside text + pill CTA. Image frame
 * uses a `5px` corner radius.
 *
 * @param props - Layout side, media, and copy
 */
export function MarketingImageTextSplit({
  sectionId,
  imageSrc,
  imageAlt,
  imageWidth = 520,
  imageHeight = 680,
  imageSide,
  heading,
  headingId,
  body,
  ctaLabel,
  ctaHref,
}: MarketingImageTextSplitProps) {
  const hid = headingId ?? `split-heading-${heading.slice(0, 12)}`;
  const imageBlock = (
    <div className="relative w-full max-w-md justify-self-center overflow-hidden rounded-[5px] md:max-w-none">
      <Image
        alt={imageAlt}
        className="h-auto w-full object-cover"
        height={imageHeight}
        src={imageSrc}
        width={imageWidth}
        sizes="(max-width: 768px) 100vw, 45vw"
      />
    </div>
  );

  const textBlock = (
    <div
      aria-labelledby={hid}
      className="flex max-w-xl flex-col justify-center justify-self-start text-left"
    >
      <h2
        id={hid}
        className="text-2xl font-normal leading-snug text-foreground md:text-[28px] md:leading-snug"
      >
        {heading}
      </h2>
      <p className="mt-5 text-base font-normal leading-relaxed text-[#444444] md:text-lg">
        {body}
      </p>
      <div className="mt-8">
        <MarketingPillLink href={ctaHref}>{ctaLabel}</MarketingPillLink>
      </div>
    </div>
  );

  return (
    <section
      className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:gap-14 md:px-6"
      id={sectionId}
    >
      {imageSide === 'left' ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          <div className="md:order-2">{imageBlock}</div>
          <div className="md:order-1">{textBlock}</div>
        </>
      )}
    </section>
  );
}
