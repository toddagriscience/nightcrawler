// Copyright © Todd Agriscience, Inc. All rights reserved.

import { urlFor } from '@/lib/sanity/utils';
import { type SanityImageSource } from '@sanity/image-url';
import { PortableTextComponentProps } from 'next-sanity';
import Image from 'next/image';

// eslint-disable-next-line no-secrets/no-secrets
/** A helper function for an image loaded with Sanity
 *
 * @param {PortableTextComponentProps<SanityImageSource>} value - The image information, from Sanity
 * @returns {JSX.Element} - The rendered image.*/
export default function SanityThumbnailImage({
  value,
}: {
  value: PortableTextComponentProps<SanityImageSource>;
}) {
  return (
    <Image
      width={1000}
      height={1000}
      src={urlFor(value)?.url()}
      alt=""
      loading="eager"
    />
  );
}
