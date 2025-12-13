import { type SanityImageSource } from '@sanity/image-url';
import Image from 'next/image';
import { PortableTextComponentProps } from 'next-sanity';
import { urlFor } from '@/lib/sanity/utils';

/** A helper function for an image loaded with Sanity
 *
 * @param {PortableTextComponentProps<SanityImageSource>} value - The image information, from Sanity
 * @returns {JSX.Element} - The rendered image.*/
export default function SanityImage({
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
