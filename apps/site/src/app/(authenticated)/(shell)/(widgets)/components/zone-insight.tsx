// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Shared vertical spacing for each stacked zone section. */
export const ZONE_SECTION_CLASS = 'py-6';

/** Props for the latest-analysis insight block. */
export interface ZoneInsightProps {
  /** Brief analysis summary shown as the lead. */
  summary?: string | null;
  /** Macro recommended action shown under the label. */
  action?: string | null;
}

/**
 * Latest-analysis write-up: summary above a recommended-action block.
 * Renders nothing when both fields are empty.
 *
 * @param {ZoneInsightProps} props - Component props.
 * @returns {React.ReactNode} The insight section, or null.
 */
export function ZoneInsight({ summary, action }: ZoneInsightProps) {
  const trimmedSummary = summary?.trim() ?? '';
  const trimmedAction = action?.trim() ?? '';

  if (!trimmedSummary && !trimmedAction) {
    return null;
  }

  return (
    <section className={ZONE_SECTION_CLASS}>
      {trimmedSummary ? (
        <p className="text-foreground text-xl font-medium">{trimmedSummary}</p>
      ) : null}
      {trimmedAction ? (
        <div
          className={trimmedSummary ? 'border-foreground/10 mt-6' : undefined}
        >
          <p className="text-foreground/50 text-xs tracking-wider uppercase">
            Recommended action
          </p>
          <p className="text-foreground/80 mt-3 text-sm leading-relaxed">
            {trimmedAction}
          </p>
        </div>
      ) : null}
    </section>
  );
}
