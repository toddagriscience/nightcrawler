// Copyright © Todd Agriscience, Inc. All rights reserved.

/** One labelled block (e.g. Values) with intro and titled bullets */
export interface MarketingValueOperatingBlockCopy {
  /**
   * Run-in label opening the first paragraph (e.g. `Values:`), before {@link intro} in the
   * same paragraph.
   */
  sectionHeading: string;
  /** Remainder of the lead paragraph after {@link sectionHeading} */
  intro: string;
  /** Title line + body per row (title usually ends with a period) */
  items: readonly { title: string; body: string }[];
}

/** Props for {@link MarketingValuesOperatingStack} */
export interface MarketingValuesOperatingStackProps {
  /** Optional wrapper id (layout hooks) */
  id?: string;
  /** First block — typically company values */
  values: MarketingValueOperatingBlockCopy;
  /** Second block — typically operating principles */
  operatingPrinciples: MarketingValueOperatingBlockCopy;
}

/**
 * Stacked Values / Operating principles blocks: lead paragraph is label + intro, then a
 * spaced list with disc markers aligned to the block (inside positioning for consistent
 * padding with the lead paragraph).
 *
 * @param props - Two prose blocks with lists
 */
export function MarketingValuesOperatingStack({
  id,
  values,
  operatingPrinciples,
}: MarketingValuesOperatingStackProps) {
  const renderBlock = (
    block: MarketingValueOperatingBlockCopy,
    sectionId: string
  ) => {
    const leadId = `${sectionId}-lead`;
    return (
      <section
        aria-labelledby={leadId}
        className="max-w-[640px] text-left"
        id={sectionId}
      >
        <p
          className="text-base font-normal leading-relaxed text-foreground"
          id={leadId}
        >
          {block.sectionHeading} {block.intro}
        </p>
        <ul className="mt-8 list-inside list-disc marker:text-foreground">
          {block.items.map((item, index) => (
            <li
              className="pl-2 text-base font-normal leading-relaxed text-foreground"
              key={`${sectionId}-${index}`}
            >
              {item.title} {item.body}
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div
      className="mx-auto flex w-full max-w-[720px] flex-col gap-16 md:gap-20"
      id={id}
    >
      {renderBlock(values, 'careers-values')}
      {renderBlock(operatingPrinciples, 'careers-operating-principles')}
    </div>
  );
}
