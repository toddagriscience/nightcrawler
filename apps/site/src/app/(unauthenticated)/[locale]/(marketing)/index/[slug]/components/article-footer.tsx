// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ArticleUiSubscript } from '../types';

/**
 * Author line and footnotes area below the article body.
 *
 * @param props - Author, optional repeated subtitle, and subscript list
 */
export function ArticleFooter({
  author,
  footerSubtitle,
  subscripts,
}: {
  author?: string;
  footerSubtitle?: string;
  subscripts: ArticleUiSubscript[];
}) {
  if (!author && subscripts.length === 0) return null;

  return (
    <section className="mb-10 w-full max-w-[685px] mx-auto text-left">
      {author !== undefined && author !== null && author.length > 0 ? (
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
          {footerSubtitle !== undefined && footerSubtitle.length > 0 ? (
            <p className="text-[14px] font-normal leading-[32px] tracking-normal text-foreground">
              {footerSubtitle}
            </p>
          ) : null}
          <div className="mt-4 flex flex-col gap-3">
            {subscripts.map((subscript, index) => (
              <p
                key={`${subscript.label ?? index}-${subscript.text}`}
                className="text-[14px] italic font-normal leading-[22px] tracking-normal text-foreground"
              >
                <sup className="mr-1 inline-block align-super text-[10px] not-italic leading-none text-[#848484]">
                  {subscript.label !== undefined && subscript.label.length > 0
                    ? subscript.label
                    : `${index + 1}`}
                </sup>
                {subscript.url !== undefined ? (
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
  );
}
