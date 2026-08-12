// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Stands in for `next/image` under the React Vite builder.
 *
 * Without it, `next/image` resolves to the real component and routes every
 * `src` through Next's optimizer as `/_next/image?url=...`. Storybook serves
 * `public` and nothing else, so there is no such endpoint and every image in
 * every story breaks. The real component also reads `process.env` at module
 * scope, which the Vite preview does not define.
 *
 * Vite hands static imports back as plain URL strings rather than the
 * `StaticImageData` object the Next loader builds, so `src` is accepted in
 * both shapes.
 */

import React from 'react';

/** The object shape Next's static image import produces. */
interface StaticImageData {
  src: string;
  height?: number;
  width?: number;
  blurDataURL?: string;
}

type NextImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'placeholder'
> & {
  src: string | StaticImageData;
  alt: string;
  width?: number | string;
  height?: number | string;
  /** Next-only props, accepted so stories type-check, then dropped. */
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  overrideSrc?: string;
};

/**
 * Renders a plain `<img>` pointing at the asset's real served URL.
 *
 * @param props - `next/image` props; Next-only ones are dropped
 * @returns An `img` element
 */
export default function NextImageMock({
  src,
  alt,
  width,
  height,
  fill,
  priority: _priority,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  loader: _loader,
  overrideSrc,
  style,
  ...rest
}: NextImageProps) {
  const resolved = overrideSrc ?? (typeof src === 'string' ? src : src.src);

  // `fill` positions the image against its nearest positioned ancestor, which
  // layouts here depend on for cropping.
  const fillStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : // Dimensions go inline, not just on the attributes: Tailwind's preflight
      // sets `img { max-width: 100%; height: auto }`, and inside a
      // shrink-to-fit parent whose own width comes from this image, that
      // resolves circularly to 0×0. `maxWidth: none` breaks the cycle, which
      // is what lets the wordmark appear at all.
      {
        ...(width === undefined ? {} : { width, maxWidth: 'none' }),
        ...(height === undefined ? {} : { height }),
      };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      width={width}
      height={height}
      src={resolved}
      alt={alt}
      style={{ ...fillStyle, ...style }}
    />
  );
}
