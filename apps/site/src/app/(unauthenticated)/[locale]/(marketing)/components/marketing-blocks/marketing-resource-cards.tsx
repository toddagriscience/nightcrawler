// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';

import { MarketingSectionHeader } from './marketing-section-header';

/** One resource teaser card */
export interface MarketingResourceCard {
  title: string;
  category: string;
  imageSrc?: string;
  imageAlt?: string;
}

/** Resources grid with optional eyebrow / title above the cards */
export interface MarketingResourceCardsProps {
  sectionId?: string;
  eyebrow?: string;
  /** Merged onto the eyebrow line (e.g. `text-black` on the careers hub) */
  eyebrowClassName?: string;
  title?: string;
  cards: readonly MarketingResourceCard[];
}

/**
 * Three-up cards with optional thumbnail (`font-normal`).
 *
 * @param props - Optional header labels and card payloads
 */
export function MarketingResourceCards({
  sectionId,
  eyebrow,
  eyebrowClassName,
  title,
  cards,
}: MarketingResourceCardsProps) {
  const showHeader =
    (eyebrow !== undefined && eyebrow.length > 0) ||
    (title !== undefined && title.trim().length > 0);
  const headingId =
    sectionId !== undefined && sectionId.length > 0
      ? `${sectionId}-heading`
      : 'marketing-resource-cards-heading';

  return (
    <section
      aria-labelledby={showHeader ? headingId : undefined}
      className="mx-auto w-full max-w-6xl px-4 md:px-6"
      id={sectionId}
    >
      {showHeader ? (
        <MarketingSectionHeader
          eyebrow={eyebrow}
          eyebrowClassName={eyebrowClassName}
          id={headingId}
          title={title}
        />
      ) : null}
      <div
        className={`mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 ${showHeader ? 'mt-12 md:mt-14' : ''}`}
      >
        {cards.map((card, index) => (
          <article
            key={`${card.title}-${index}`}
            className="flex flex-col text-left"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-neutral-200">
              {card.imageSrc !== undefined && card.imageSrc.length > 0 ? (
                <Image
                  alt={card.imageAlt ?? ''}
                  className="h-full w-full object-cover"
                  height={600}
                  src={card.imageSrc}
                  width={800}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : null}
            </div>
            <h3 className="mt-4 text-lg font-normal leading-snug text-foreground">
              {card.title}
            </h3>
            <p className="mt-1 text-sm font-normal text-[#848484]">
              {card.category}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
