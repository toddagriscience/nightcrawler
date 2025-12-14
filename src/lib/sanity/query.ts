// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client } from '@/lib/sanity/client';
import { FilteredResponseQueryOptions, SanityDocument } from 'next-sanity';

/** A helper function for querying Sanity. This function may need to be refactored in the future, as when it was created, the only Sanity document type that existed was `news`.
 *
 * Queries with `@lib/sanity/client`'s fetch function.
 *
 * @param {string} documentType - The document type, most likely `news`
 * @param {string} params.slug - Optional. The parameters for the query
 * @param {FilteredResponseQueryOptions} - Any options for the query.
 * @param {number} index - The index for the GROQ query. The default, 0, is usually fine.*/
export default async function sanityQuery(
  documentType: string,
  params: { slug?: string } = {},
  options?: FilteredResponseQueryOptions,
  index?: number
) {
  const postQuery = `*[_type == "${documentType}"${params.slug ? ' && slug.current == $slug' : ''}]${index !== undefined ? `[${index}]` : ''}`;

  const post = await client.fetch<SanityDocument>(postQuery, params, options);

  return post;
}
