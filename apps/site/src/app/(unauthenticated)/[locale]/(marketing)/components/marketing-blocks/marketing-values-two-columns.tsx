// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Intro + titled bullets for one column */
export interface MarketingValueColumnCopy {
  /** Opening paragraph */
  intro: string;
  /** Bold-feel title line plus supporting body */
  items: readonly { title: string; body: string }[];
}

/** Props for {@link MarketingValuesTwoColumns} */
export interface MarketingValuesTwoColumnsProps {
  /** Section id for in-page anchors */
  id?: string;
  /** Large centered statement above the columns */
  statement: string;
  /** Left / right columns */
  left: MarketingValueColumnCopy;
  right: MarketingValueColumnCopy;
}

/**
 * Statement headline plus two-column value lists (`font-normal`).
 *
 * @param props - Statement and column payloads
 */
export function MarketingValuesTwoColumns({
  id,
  statement,
  left,
  right,
}: MarketingValuesTwoColumnsProps) {
  const statementHeadingId =
    id !== undefined ? `${id}-statement` : 'marketing-values-statement';

  const renderColumn = (column: MarketingValueColumnCopy, side: string) => (
    <div className="min-w-0">
      <p className="text-base font-normal leading-relaxed text-foreground">
        {column.intro}
      </p>
      <ul className="mt-8 list-none space-y-8 pl-0">
        {column.items.map((item, index) => (
          <li key={`${side}-${index}`} className="space-y-2">
            <p className="text-base font-normal leading-snug text-foreground">
              {item.title}
            </p>
            <p className="text-base font-normal leading-relaxed text-[#444444]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section
      aria-labelledby={statementHeadingId}
      className="mx-auto w-full max-w-5xl px-4 md:px-6"
      id={id}
    >
      <h2
        id={statementHeadingId}
        className="mx-auto max-w-3xl text-center text-2xl font-normal leading-snug text-foreground md:text-[26px] md:leading-snug"
      >
        {statement}
      </h2>
      <div className="mx-auto mt-14 grid max-w-[900px] grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
        {renderColumn(left, 'left')}
        {renderColumn(right, 'right')}
      </div>
    </section>
  );
}
