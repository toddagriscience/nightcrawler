// Copyright © Todd Agriscience, Inc. All rights reserved.

import ArticleShareCopyLink from '@/components/common/news/article-share-copy-link';
import SanityHeaderImage from '@/components/sanity/news/sanity-header-image';
import SanityNormal from '@/components/sanity/news/sanity-normal';
import SanityLink from '@/components/sanity/sanity-link';
import sanityQuery from '@/lib/sanity/query';
import { urlFor } from '@/lib/sanity/utils';
import { PortableText, PortableTextReactComponents } from 'next-sanity';
import { notFound, redirect } from 'next/navigation';

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

  const headerImageUrl = article.headerImage
    ? urlFor(article.headerImage)?.url()
    : undefined;

  const formattedDate =
    article.date != null
      ? new Date(article.date as string)
          .toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
          .replace(/\s(\d{4})$/, ', $1')
      : '';
  const company = article.company;
  const author = article.author;
  const subtitle = article.subtitle;
  const parsedSubscripts = Array.isArray(article.subscripts)
    ? article.subscripts.filter(
        (item): item is { label?: string; text: string; url?: string } =>
          typeof item?.text === 'string' && item.text.trim().length > 0
      )
    : [];
  const subscripts = parsedSubscripts;

  /** Sanity helpers. See: https://github.com/portabletext/react-portabletext#customizing-components */
  const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: (props) => <SanityNormal {...props} summary={article.summary} />,

      h1: ({ children }) => (
        <h1 className="mt-[53px] text-3xl md:text-4xl lg:text-5xl font-normal leading-snug mb-2">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="mt-[53px] text-2xl md:text-3xl lg:text-[30px]/[41px] font-normal leading-snug mb-2">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-[53px] text-xl md:text-2xl lg:text-3xl font-normal leading-snug mb-2">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mt-[53px] text-xl md:text-2xl lg:text-3xl font-normal leading-snug mb-2">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="mt-[53px] text-lg md:text-xl lg:text-[20px]/[28px] font-normal leading-snug mb-2">
          {children}
        </h5>
      ),
    },
    marks: {
      link: (props) => <SanityLink {...props} />,
    },
  };

  return (
    <div className="max-w-[80%] mx-auto">
      <main className="mt-20 container mx-auto min-h-screen flex flex-col gap-10 md:gap-4">
        {/* Article Header */}
        <header className="flex w-full max-w-[686px] flex-col items-center mx-auto lg:mb-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[14px] font-normal leading-[28px] tracking-normal">
            {formattedDate ? (
              <time dateTime={String(article.date)}>{formattedDate}</time>
            ) : null}
            {company ? (
              <>
                <span className="text-[#848484]">{company}</span>
              </>
            ) : null}
          </div>
          <h2 className="w-full max-w-[664px] mx-auto text-balance text-center font-normal tracking-normal text-[2rem] leading-[2rem] sm:text-[2.5rem] sm:leading-[2.5rem] md:text-[3rem] md:leading-[3rem] lg:text-[64px] lg:leading-[64px] mt-4 mb-8">
            {article.title}
          </h2>
          {subtitle ? (
            <p className="w-full max-w-[661px] mx-auto mb-8 text-center text-[16px] font-normal leading-[27px] tracking-normal text-foreground">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-10 w-full border-t-[1px] border-[#EFEFEF] pt-6">
            <ArticleShareCopyLink />
          </div>
        </header>
        {/* Article Header Image */}
        {article.headerImage && (
          <div className="mt-8 mb-8 md:mb-12 lg:mb-16 flex flex-col items-center justify-center w-full mx-auto">
            <SanityHeaderImage
              headerImage={article.headerImage}
              src={headerImageUrl}
              alt={article.headerImage.alt ?? article.title ?? ''}
              wrapperClassName="w-full"
              overlayClassName="transition-all duration-200 ease-in-out"
            />
          </div>
        )}
        {/* Article Content */}
        <div className="mt-10 mb-10 sm:mb-20 md:mb-26 flex w-full max-w-[685px] flex-col gap-[7px] mx-auto text-left">
          {Array.isArray(article.content) && (
            <PortableText
              value={article.content}
              components={portableTextComponents}
            />
          )}
        </div>
        {author || subscripts.length > 0 ? (
          <section className="mb-10 w-full max-w-[685px] mx-auto text-left">
            {author ? (
              <>
                <p className="text-[14px] font-normal leading-[32px] tracking-normal text-[#848484]">
                  Author
                </p>
                <p className="text-[14px] font-normal leading-[32px] tracking-normal text-foreground">
                  {author}
                </p>
              </>
            ) : null}
            {subscripts.length > 0 ? (
              <div className="mt-6 w-full max-w-[645px]">
                {subtitle ? (
                  <p className="text-[14px] font-normal leading-[32px] tracking-normal text-foreground">
                    {subtitle}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-col gap-3">
                  {subscripts.map((subscript, index) => (
                    <p
                      key={`${subscript.label ?? index}-${subscript.text}`}
                      className="text-[14px] italic font-normal leading-[22px] tracking-normal text-foreground"
                    >
                      <sup className="mr-1 inline-block align-super text-[10px] not-italic leading-none text-[#848484]">
                        {subscript.label || `${index + 1}`}
                      </sup>
                      {subscript.url ? (
                        <a
                          href={subscript.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {subscript.text}
                        </a>
                      ) : (
                        subscript.text
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}
