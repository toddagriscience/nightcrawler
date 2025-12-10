// Copyright Todd Agriscience, Inc. All rights reserved.
import {
  PortableText,
  PortableTextReactComponents,
  type SanityDocument,
} from 'next-sanity';
import { client } from '@/lib/sanity/client';
import SanityImage from '@/components/sanity/sanity-image';
import SanityNormal from '@/components/sanity/sanity-normal';
import { Link } from '@/i18n/config';

const POST_QUERY = `*[_type == "news" && slug.current == $slug][0]`;
const options = { next: { revalidate: 30 } };

/** Sanity helpers. See: https://github.com/portabletext/react-portabletext#customizing-components */
const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: SanityImage,
  },
  block: {
    normal: SanityNormal,
  },
};

/**
 * A news article page, rendered with Sanity CMS.
 *
 * @param {Promise<{ slug: string }>} params - The slug of the article
 * @returns {JSX.Element} - The rendered news article*/
export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options
  );

  return (
    <main className="mt-16 mb-16 container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/news" className="hover:underline">
        ← Back to articles
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-baseline">
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div className="flex flex-col justify-end">
          <p>Published: {new Date(post.date).toLocaleDateString()}</p>
          <div className="flex flex-row"></div>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {Array.isArray(post.content) && (
          <PortableText
            value={post.content}
            components={portableTextComponents}
          />
        )}
      </div>
    </main>
  );
}
