// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';

/**
 * Grotesque stack rather than Neue Haas Unica: the page is carried entirely by
 * heavy display type, and the brand face only ships Light and Regular, which
 * the browser would have to fake-bold.
 */
const DISPLAY_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Contact address for cohort-one applications. */
const CONTACT_EMAIL = 'cjxsez@gmail.com';

/** Prefilled subject, so cohort-one mail sorts itself in the inbox. */
const CONTACT_SUBJECT = 'J Fellows — cohort one';

/**
 * The statement, in reading order. The first line becomes the page's `h1`; the
 * rest are paragraphs set at the same size, so the block reads as one argument
 * rather than a heading with supporting copy.
 */
const STATEMENT = [
  'Ambition shows up early. Almost nobody develops it.',
  'The Todd Founder Program finds teenage founders with real traction. J Fellows is the part that develops them.',
  'Ten fellows. Five months of hard development, five more of weekly mentorship, then back into Todd as founders, externs, and interns.',
  'Applications for the first cohort are open. It is free, and it is brutally selective.',
];

/**
 * The J Fellows statement page at `/j-fellows`.
 *
 * @returns The J Fellows page
 */
export default function JFellowsPage() {
  const [opening, ...rest] = STATEMENT;

  return (
    <main
      style={{ fontFamily: DISPLAY_STACK }}
      className="flex min-h-screen flex-col bg-white px-7 py-9 text-[#111111] sm:px-12 sm:py-12 lg:px-[7.5%] lg:py-[4.5%]"
    >
      <header className="flex items-center gap-2.5">
        <Image
          src="/j-fellows/j-mark.png"
          alt=""
          width={340}
          height={508}
          priority
          className="h-[22px] w-auto sm:h-[26px]"
        />
        <span className="text-[13px] font-bold tracking-[0.15em] uppercase">
          J Fellows
        </span>
      </header>

      <div className="flex flex-1 items-center py-14 sm:py-16">
        <div className="max-w-[880px] space-y-5 text-[22px] leading-[1.18] font-bold tracking-[-0.021em] sm:space-y-6 sm:text-[28px] lg:space-y-7 lg:text-[36px]">
          <h1>{opening}</h1>
          {rest.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <footer className="space-y-1.5 text-[15px] text-[#9a9a9a] sm:text-[17px]">
        <p>A collaboration between J Fellows and the Todd Founder Program.</p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`}
          className="inline-block transition-colors hover:text-[#111111] focus-visible:rounded-xs focus-visible:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
        >
          {CONTACT_EMAIL}
        </a>
      </footer>
    </main>
  );
}
