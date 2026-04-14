// Copyright © Todd Agriscience, Inc. All rights reserved.

import NextImage from 'next/image';

/**
 * Image component
 * @param src - The source of the wordmarkimage
 * @param alt - The alt text of the wordmark image
 * @param width - The width of the wordmark image
 * @param height - The height of the wordmark image
 * @returns {JSX.Element} - The wordmark image component
 * @param caption - The caption of the wordmark image
 */
export default function WordmarkImage({
  src,
  alt,
  caption,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  /** Set true for above-the-fold images (LCP candidates). */
  priority?: boolean;
}) {
  return (
    <div className={`flex flex-col text-left ${className}`}>
      <div className="relative w-full">
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 532px"
          className="!relative object-contain"
          priority={priority}
        />
      </div>
      {caption ? (
        <p className="text-sm/[30px] font-thin mt-6 md:mt-10">{caption}</p>
      ) : null}
    </div>
  );
}
