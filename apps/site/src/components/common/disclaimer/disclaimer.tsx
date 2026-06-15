// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';

/**
 * Disclaimer component. Renders legal disclaimers via next-intl. Having to manually add the # of disclaimers to each instance of this component is a pain, but Vitest was having issues with using the `.raw()` function from next-intl, so for sake of time I'm avoiding fixing this.
 *
 * When `linkHref` is provided, disclaimer strings may contain a `<link>...</link>`
 * tag that is rendered as a locale-aware link to that destination. This lets a
 * disclaimer route users to an inquiry form instead of exposing a raw email
 * address. Strings without the tag are unaffected, so callers that omit
 * `linkHref` keep the original plain-text rendering.
 *
 * @param {string} translationLoc - The name of the translation. Ex. `common` or `careers`
 * @param {number} disclaimerCount - The number of separate disclaimers (paragarphs)
 * @param {string} [linkHref] - Optional destination for a `<link>` tag inside any disclaimer string
 *
 * @returns {JSX.Element} - The disclaimer component
 * */
export function Disclaimer({
  translationLoc,
  disclaimerCount,
  linkHref,
}: {
  translationLoc: string;
  disclaimerCount: number;
  linkHref?: string;
}) {
  const t = useTranslations(translationLoc);

  return (
    <section className="mb-32 max-w-[1200px] w-[80vw] mx-auto space-y-1 text-sm leading-relaxed font-light pl-8 indent-[-1rem]">
      {Array.from({ length: disclaimerCount }).map((_, i) => (
        <p key={i}>
          {i + 1}.{' '}
          {linkHref
            ? t.rich(String(i), {
                link: (chunks) => (
                  <Link href={linkHref} className="underline">
                    {chunks}
                  </Link>
                ),
              })
            : t(String(i))}
        </p>
      ))}
    </section>
  );
}
