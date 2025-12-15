// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PortableText, PortableTextReactComponents } from 'next-sanity';
import SanityImage from '@/components/sanity/sanity-image';
import SanityNormal from '@/components/sanity/sanity-normal';
import { Link } from '@/i18n/config';
import sanityQuery from '@/lib/sanity/query';
import ShareArticleButtons from '@/components/common/share-article/share-article';
import { redirect } from 'next/navigation';

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
  const article = await sanityQuery(
    'news',
    await params,
    { next: { revalidate: 60 * 60 } },
    0
  );

  if (article.offSiteUrl && article.offSiteUrl.length > 0) {
    redirect(article.offSiteUrl);
  }

  return (
    <main className="mt-16 mb-16 container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/news" className="hover:underline">
        ← Back to articles
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
        <div className="flex md:flex-col flex-row items-center md:justify-end justify-between md:w-min w-full">
          <p className="md:mb-4 md:ml-auto pr-2">
            {new Date(article.date).toLocaleDateString()}
          </p>
          <div className="ml-auto flex flex-row">
            <ShareArticleButtons title={article.title} />
          </div>
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
