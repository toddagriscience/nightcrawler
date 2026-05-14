// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Centered stack used above grids (benefits, resources, etc.) */
export interface MarketingSectionHeaderProps {
  /** Optional DOM id for `aria-labelledby` (on `h2`, or on the eyebrow when there is no title) */
  id?: string;
  /** Small centered eyebrow above the title */
  eyebrow?: string;
  /** Primary heading; omit for eyebrow-only sections */
  title?: string;
  /** Supporting sentence under the title */
  subtitle?: string;
}

/**
 * Centered marketing section title stack (`font-normal`, responsive sizing).
 *
 * @param props - Visual hierarchy labels
 */
export function MarketingSectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
}: MarketingSectionHeaderProps) {
  const hasEyebrow = eyebrow !== undefined && eyebrow.length > 0;
  const hasTitle = title !== undefined && title.trim().length > 0;

  return (
    <header className="mx-auto max-w-3xl px-4 text-center md:px-6">
      {hasEyebrow ? (
        <p
          className="text-sm font-normal tracking-normal text-[#848484]"
          id={hasTitle ? undefined : id}
        >
          {eyebrow}
        </p>
      ) : null}
      {hasTitle ? (
        <h2
          className={`text-2xl font-normal leading-snug tracking-tight text-foreground md:text-[28px] md:leading-snug ${hasEyebrow ? 'mt-4' : ''}`}
          id={id}
        >
          {title}
        </h2>
      ) : null}
      {subtitle !== undefined && subtitle.length > 0 ? (
        <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
