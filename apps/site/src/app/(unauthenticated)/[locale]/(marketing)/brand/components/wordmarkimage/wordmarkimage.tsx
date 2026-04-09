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
  width,
  height,
  caption,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col text-left ${className}`}>
      <NextImage src={src} alt={alt} width={width} height={height} />
      {caption ? (
        <p className="text-sm/[30px] font-thin mt-2">{caption}</p>
      ) : null}
    </div>
  );
}
