import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';
import { client } from '@/lib/sanity/client';
import Image from 'next/image';
import { PortableTextComponentProps } from 'next-sanity';

const { projectId = 'NO_PROJECT_ID', dataset = 'NO_DATASET' } = client.config();

/** A helper function for an image loaded with Sanity
 *
 * @param {PortableTextComponentProps<SanityImageSource>} value - The image information, from Sanity
 * @returns {JSX.Element} - The rendered image.*/
export default function SanityImage({
  value,
}: {
  value: PortableTextComponentProps<SanityImageSource>;
}) {
  return <Image width={1000} height={1000} src={urlFor(value)?.url()} alt="" />;
}

/** Helper function to build image URLS. See: https://www.sanity.io/plugins/sanity-image-url-builder
 *
 * @param {SanityImageSource} source - The image information
 * @returns {ImageUrlBuilder} - A Sanity thing for constructing the URL of an image.*/
function urlFor(source: SanityImageSource) {
  return createImageUrlBuilder({ projectId, dataset }).image(source);
}
