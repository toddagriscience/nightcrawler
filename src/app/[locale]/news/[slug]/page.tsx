// Copyright Todd Agriscience, Inc. All rights reserved.
import { PortableText, PortableTextReactComponents } from 'next-sanity';
import SanityImage from '@/components/sanity/sanity-image';
import SanityNormal from '@/components/sanity/sanity-normal';
import { Link } from '@/i18n/config';
import sanityQuery from '@/lib/sanity/query';

/** Sanity helpers. See: https://github.com/portabletext/react-portabletext#customizing-components */
const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: SanityImage,
  },
  block: {
    normal: SanityNormal,
  },
};

/** Options for `@lib/sanity/client`'s fetch function. */
const options = { next: { revalidate: 30 } };

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
  const article = await sanityQuery('news', await params, options, 0);

  return (
    <main className="mt-16 mb-16 container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/news" className="hover:underline">
        ← Back to articles
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-baseline">
        <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
        <div className="flex flex-col justify-end">
          <p>Published: {new Date(article.date).toLocaleDateString()}</p>
          <div className="flex flex-row"></div>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {Array.isArray(article.content) && (
          <PortableText
            value={article.content}
            components={portableTextComponents}
          />
        )}
      </div>
    </main>
  );
}
