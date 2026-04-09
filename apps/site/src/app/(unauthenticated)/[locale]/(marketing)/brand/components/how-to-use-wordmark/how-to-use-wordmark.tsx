// Copyright © Todd Agriscience, Inc. All rights reserved.

import { mapSectionTextParagraphs } from '@/components/section-content/section-content';

/**
 * Two-column “Do / Don’t” layout for the How to use wordmark section (matches brand guideline art direction).
 * @param title - Centered section heading
 * @param doHeading - Left column heading (e.g. “Do:”)
 * @param doText - Left column bullet strings (`count` + `"0"`…)
 * @param dontHeading - Right column heading (e.g. “Don’t:”)
 * @param dontText - Right column bullet strings
 * @returns {JSX.Element} - Grid with two bulleted columns
 */
export default function HowToUseWordmark({
  title,
  doHeading,
  doText,
  dontHeading,
  dontText,
}: {
  title: string;
  doHeading: string;
  doText: Record<string, string> | undefined;
  dontHeading: string;
  dontText: Record<string, string> | undefined;
}) {
  const doItems = mapSectionTextParagraphs(doText);
  const dontItems = mapSectionTextParagraphs(dontText);

  const listClassName =
    'list-disc pl-8 marker:text-foreground text-sm lg:text-[17px]/[30px] font-thin [&_li::marker]:text-[0.65em]';

  return (
    <section
      className="w-full max-w-[800px] mx-auto my-58 px-3"
      aria-labelledby="how-to-use-wordmark-heading"
    >
      <h3
        id="how-to-use-wordmark-heading"
        className="text-center text-xl md:text-xl lg:text-3xl/[56px] mb-10 md:mb-8"
      >
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-12 lg:gap-x-12 md:items-start text-left">
        <div>
          <h4 className="text-[17px]/[30px] mb-4 md:mb-6">{doHeading}</h4>
          {doItems.length > 0 ? (
            <ul className={listClassName}>
              {doItems.map(({ key, body }) => (
                <li key={key}>{body}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <h4 className="text-[17px]/[30px] mb-4 md:mb-6">{dontHeading}</h4>
          {dontItems.length > 0 ? (
            <ul className={listClassName}>
              {dontItems.map(({ key, body }) => (
                <li key={key}>{body}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
