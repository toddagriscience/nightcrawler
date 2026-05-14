// Copyright © Todd Agriscience, Inc. All rights reserved.

import { MarketingPillLink } from '@/app/(unauthenticated)/[locale]/(marketing)/components/marketing-blocks';
import SanityNormal from '@/components/sanity/news/sanity-normal';
import SanityLink from '@/components/sanity/sanity-link';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { logger } from '@/lib/logger';
import { PortableText } from 'next-sanity';
import type { PortableTextReactComponents } from 'next-sanity';
import { getTranslations } from 'next-intl/server';

/** Props for {@link CareersJobPosting}. */
interface CareersJobPostingProps {
  /** Sanity careers document validated by the `/careers/[slug]` guard */
  article: SanityArticle;
  /** Locale code for localized copy */
  locale: string;
}

/**
 * Returns a trimmed string or undefined when absent.
 *
 * @param raw - Optional label from Sanity
 */
function trimmedOrUndefined(raw: string | undefined): string | undefined {
  const t = raw?.trim();
  return t !== undefined && t.length > 0 ? t : undefined;
}

/**
 * Hero subtitle line `{team or company} — {location}` matching the `/careers/[slug]` template.
 *
 * @param article - Loaded careers posting
 */
function careerHeroSubtitle(article: SanityArticle): string | undefined {
  const team = trimmedOrUndefined(article.jobTeam ?? article.company);
  const location = trimmedOrUndefined(article.jobLocation);
  if (team !== undefined && location !== undefined)
    return `${team} — ${location}`;
  return team ?? location;
}

/**
 * Careers detail layout centered hero (static “Careers” kicker) and stacked apply CTAs wired to Sanity `applyUrl`.
 *
 * @param props - Article and locale
 */
export async function CareersJobPosting({
  article,
  locale,
}: CareersJobPostingProps) {
  const t = await getTranslations({ locale, namespace: 'careers' });
  const subtitle = careerHeroSubtitle(article);
  const applyHref = trimmedOrUndefined(article.applyUrl);

  if (applyHref === undefined && article._type === 'career') {
    logger.warn('Careers document missing applyUrl for on-site posting', {
      articleId: article._id,
      slug: article.slug.current,
    });
  }

  const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: (props) => <SanityNormal {...props} summary={article.summary} />,
      h1: ({ children }) => (
        <h2 className="mb-4 mt-10 text-2xl leading-snug font-normal md:text-[28px] md:leading-normal">
          {children}
        </h2>
      ),
      h2: ({ children }) => (
        <h2 className="mb-4 mt-10 text-xl leading-snug font-normal md:text-2xl">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-3 mt-10 text-xl leading-snug font-normal md:text-2xl">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mb-3 mt-8 text-lg leading-snug font-normal md:text-xl">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="mb-3 mt-8 text-base leading-snug font-normal md:text-lg">
          {children}
        </h5>
      ),
    },
    marks: {
      link: (props) => <SanityLink {...props} />,
    },
  };

  return (
    <main className="min-h-[50vh]" id={`careers-post-${article.slug.current}`}>
      <div className="mx-auto mt-16 max-w-3xl px-4 pb-24 md:px-6 lg:max-w-[820px]">
        <header className="flex flex-col items-center text-center">
          <p className="text-sm font-normal tracking-normal text-[#848484]">
            {t('jobPosting.kicker')}
          </p>
          <h1 className="mt-6 text-4xl leading-tight tracking-tight text-foreground font-normal md:text-[44px] md:leading-tight">
            {article.title}
          </h1>
          {subtitle !== undefined ? (
            <p className="mt-4 max-w-xl text-lg font-normal text-foreground">
              {subtitle}
            </p>
          ) : null}
          {applyHref ? (
            <div className="mt-8 flex justify-center">
              <MarketingPillLink href={applyHref}>
                {t('jobPosting.applyNow')}
              </MarketingPillLink>
            </div>
          ) : null}
        </header>
        <div className="mx-auto mb-14 mt-14 flex w-full max-w-[685px] flex-col gap-[7px] text-left text-foreground md:mt-16">
          {Array.isArray(article.content) ? (
            <PortableText
              components={portableTextComponents}
              value={article.content}
            />
          ) : null}
        </div>
        {applyHref ? (
          <div className="mt-16 flex justify-center pb-8">
            <MarketingPillLink href={applyHref}>
              {t('jobPosting.applyNow')}
            </MarketingPillLink>
          </div>
        ) : null}
      </div>
    </main>
  );
}
