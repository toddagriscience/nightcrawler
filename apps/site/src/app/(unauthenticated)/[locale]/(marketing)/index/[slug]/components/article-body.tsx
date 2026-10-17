// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';
import SanityHeaderImage from '@/components/sanity/news/sanity-header-image';
import type { SanityArticle } from '@/lib/sanity/article-types';
import type { PortableTextReactComponents } from 'next-sanity';
import { PortableText } from 'next-sanity';

/**
 * Main article column: hero image slot and Sanity Portable Text.
 *
 * @param props - Image and Portable Text payloads
 */
export function ArticleBody({
  headerImageAlt,
  headerImageUrl,
  headerImageAsset,
  content,
  portableTextComponents,
}: {
  headerImageAlt?: string;
  headerImageUrl: string | undefined;
  headerImageAsset: SanityArticle['headerImage'];
  content: SanityArticle['content'];
  portableTextComponents: Partial<PortableTextReactComponents>;
}) {
  return (
    <>
      {headerImageUrl ? (
        <div className="mt-8 mb-8 md:mb-12 lg:mb-16 flex flex-col items-center justify-center w-full mx-auto">
          {headerImageAsset ? (
            <SanityHeaderImage
              headerImage={headerImageAsset}
              src={headerImageUrl}
              alt={headerImageAlt ?? ''}
              wrapperClassName="w-full"
              overlayClassName="transition-all duration-200 ease-in-out"
            />
          ) : (
            <Image
              unoptimized
              src={headerImageUrl}
              alt={headerImageAlt ?? ''}
              width={1200}
              height={630}
              sizes="(max-width: 768px) 80vw, 685px"
              className="w-full h-auto rounded-sm"
            />
          )}
        </div>
      ) : null}
      <div
        data-article-body
        className="mb-10 sm:mb-20 md:mb-26 flex w-full max-w-[685px] flex-col gap-[7px] mx-auto text-left"
      >
        {Array.isArray(content) && (
          <PortableText value={content} components={portableTextComponents} />
        )}
      </div>
    </>
  );
}
