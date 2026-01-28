// Copyright © Todd Agriscience, Inc. All rights reserved.

import ShareArticleButtons from '@/components/common/share-article/share-article';
import SanityImage from '@/components/sanity/sanity-image';
import SanityNormal from '@/components/sanity/sanity-normal';
import { Link } from '@/i18n/config';
import sanityQuery from '@/lib/sanity/query';
import { PortableText, PortableTextReactComponents } from 'next-sanity';
import { notFound, redirect } from 'next/navigation';
import { HiArrowLongLeft } from 'react-icons/hi2';
import ArticleHeaderImage from './components/article-header-image';

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

  if (!article) {
    notFound();
  }

  if (article.offSiteUrl && article.offSiteUrl.length > 0) {
    redirect(article.offSiteUrl);
  }

  return (
    <div className="max-w-[80%] mx-auto">
      <main className="mt-20 mb-20 container mx-auto min-h-screen flex flex-col gap-6 md:gap-4">
        {/* Navigation back to /news page */}
        <div className="flex flex-col gap-2 w-fit">
          <Link
            href="/news"
            className="hover:underline flex items-center gap-2 text-normal font-light hover:text-foreground/80"
          >
            <HiArrowLongLeft className="size-6" />
            Back to articles
          </Link>
        </div>
        {/* Article Header */}
        <div className="flex mb-5 md:mb-9 flex-col items-center justify-center max-w-[80%] lg:px-5 mx-auto">
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl w-full text-left leading-tight font-thin md:mb-6 mb-10 lg:mb-12 mt-4">
            {article.title}
          </h2>
          <div className="w-full md:w-min w-[150px] md:w-[200px] lg:w-[250px] text-center">
            <p className="md:mb-4 text-xs md:text-sm lg:text-normal font-light leading-relaxed text-center whitespace-nowrap">
              {new Date(article.date)
                .toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                .replace(/\s(\d{4})$/, ', $1')}
            </p>
          </div>
        </div>
        {/* Article Header Image */}
        <div className=" mb-16 flex flex-col items-center justify-center w-full mx-auto">
          <ArticleHeaderImage
            src="/pinklemonade.webp"
            alt="test image"
            wrapperClassName="w-full"
            overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
          />
        </div>
        {/* Article Content */}
        <div className="mb-20 md:mb-44 flex flex-col gap-10 items-center justify-center max-w-[85%] mx-auto text-normal md:text-base lg:text-base font-light leading-relaxed text-center">
          {Array.isArray(article.content) && (
            <PortableText
              value={article.content}
              components={portableTextComponents}
            />
          )}
        </div>
        {/* Share Article Buttons */}
        <div className="flex flex-col gap-2 items-center justify-center h-[15vh]">
          <h3 className="text-xs lg:text-sm w-full text-center leading-tight font-normal">
            SHARE
          </h3>
          <div className="flex flex-row justify-center gap-2 items-center">
            <ShareArticleButtons title={article.title} />
          </div>
        </div>
      </main>
    </div>
  );
}
