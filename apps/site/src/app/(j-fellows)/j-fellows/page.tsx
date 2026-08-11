// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';
import ToddWordmark from '@public/wordmark.svg';

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
  'Every year a handful of teenagers build something real. Then the world tells them to wait their turn.',
  'We do not teach patience. Todd finds them. J Fellows forges them.',
  'Ten fellows. Five months hard enough to break the version of you that walked in.',
  'Cohort one is open. It costs nothing, and almost nobody gets in.',
  'Keep your options open, or find out what you are actually made of. Only one of those is on the table.',
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
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
        <div className="flex items-center gap-2.5">
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
        </div>

        <span aria-hidden="true" className="h-[17px] w-px bg-[#d0d0d0]" />

        <div className="flex items-center gap-2">
          {/* The logotype spells "Todd", so it carries that half of the name
              and the text picks up where it leaves off. */}
          <Image
            src={ToddWordmark}
            alt="Todd"
            className="h-[13px] w-auto"
            width={76}
            height={25}
          />
          <span className="text-[13px] font-bold tracking-[0.15em] uppercase">
            Founder Program
          </span>
        </div>
      </header>

      <div className="flex flex-1 items-center py-10 sm:py-14">
        <div
          // Sized against the viewport's height as well as its width: the
          // closing line is the whole point, and it has to land on screen
          // rather than below the fold on a short window.
          style={{ fontSize: 'clamp(1.25rem, min(2.4vw, 4vh), 2.25rem)' }}
          className="max-w-[880px] space-y-[0.72em] leading-[1.18] font-bold tracking-[-0.021em]"
        >
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
