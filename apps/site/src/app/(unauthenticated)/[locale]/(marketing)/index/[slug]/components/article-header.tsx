// Copyright © Todd Agriscience, Inc. All rights reserved.

import ArticleShareCopyLink from '@/components/common/news/article-share-copy-link';

/**
 * Hero block for CMS article titles and metadata lines.
 *
 * @param props - Header content fields
 */
export function ArticleHeader({
  title,
  subtitle,
  company,
  dateTime,
  formattedDate,
}: {
  /** Article headline */
  title: string;
  /** Optional deck line */
  subtitle?: string;
  /** Optional company attribution */
  company?: string;
  /** ISO date for `<time datetime>` when present */
  dateTime?: string;
  /** Already localized date presentation */
  formattedDate?: string;
}) {
  return (
    <header className="flex w-full max-w-[686px] flex-col items-center mx-auto lg:mb-6">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[14px] font-normal leading-[28px] tracking-normal">
        {formattedDate !== undefined && formattedDate.length > 0 ? (
          <time
            dateTime={
              dateTime !== undefined && dateTime.length > 0
                ? dateTime
                : undefined
            }
          >
            {formattedDate}
          </time>
        ) : null}
        {company !== undefined && company !== null ? (
          <span className="text-[#848484]">{company}</span>
        ) : null}
      </div>
      <h2 className="w-full max-w-[664px] mx-auto text-balance text-center font-normal tracking-normal text-[2rem] leading-[2rem] sm:text-[2.5rem] sm:leading-[2.5rem] md:text-[3rem] md:leading-[3rem] lg:text-[64px] lg:leading-[64px] mt-4 mb-4">
        {title}
      </h2>
      {subtitle !== undefined ? (
        <p className="w-full max-w-[661px] mx-auto mb-6 text-center text-[16px] font-normal leading-[27px] tracking-normal text-foreground">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-6 w-full border-t-[1px] border-[#EFEFEF] pt-6">
        <ArticleShareCopyLink />
      </div>
    </header>
  );
}
