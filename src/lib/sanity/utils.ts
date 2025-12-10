import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';
import { client } from '@/lib/sanity/client';

/** Helper function to build image URLS. See: https://www.sanity.io/plugins/sanity-image-url-builder
 *
 * @param {SanityImageSource} source - The image information
 * @returns {ImageUrlBuilder} - A Sanity thing for constructing the URL of an image.*/
export function urlFor(source: SanityImageSource) {
  const { projectId = 'NO_PROJECT_ID', dataset = 'NO_DATASET' } =
    client.config();
  return createImageUrlBuilder({ projectId, dataset }).image(source);
}
