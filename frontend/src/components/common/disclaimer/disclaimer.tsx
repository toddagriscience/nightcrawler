// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useTranslations } from 'next-intl';

/**
 * Disclaimer component. Renders legal disclaimers via next-intl. Having to manually add the # of disclaimers to each instance of this component is a pain, but Vitest was having issues with using the `.raw()` function from next-intl, so for sake of time I'm avoiding fixing this.
 *
 * @param {string} translationLoc - The name of the translation. Ex. `common` or `careers`
 * @param {numer} disclaimerCount - The number of separate disclaimers (paragarphs)
 *
 * @returns {JSX.Element} - The disclaimer component
 * */
export function Disclaimer({
  translationLoc,
  disclaimerCount,
}: {
  translationLoc: string;
  disclaimerCount: number;
}) {
  const t = useTranslations(translationLoc);

  return (
    <section className="mb-32 max-w-[1200px] w-[80vw] mx-auto space-y-1 text-sm leading-relaxed font-light">
      {Array.from({ length: disclaimerCount }).map((_, i) => (
        <p key={i}>
          {i + 1}. {t(String(i))}
        </p>
      ))}
    </section>
  );
}
