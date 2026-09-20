// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { PhRangeModel } from './to-ph-range';
import { ZONE_SECTION_CLASS, ZoneInsight } from './zone-insight';
import {
  ZoneMineralCharts,
  type ZoneMineralChart,
} from './zone-mineral-charts';
import { ZonePhRange } from './zone-ph-range';
import { ZoneSearchForm } from './zone-search-form';

/** Placeholder until advisors are modeled in the DB. */
const LEAD_ADVISOR_PLACEHOLDER = 'Not assigned';

const HEADING_CLASS = 'text-sm font-medium text-foreground';

/** Props for the active (has-analysis) zone dashboard. */
export interface ZoneActiveTemplateProps {
  /** Selected management zone name. */
  zoneName: string;
  /** Formatted latest sample date. */
  sampleLabel: string;
  /** Formatted next scheduled sample date. */
  nextLabel: string;
  /** Prepared Calcium charts. */
  charts: ZoneMineralChart[];
  /** Mapped pH range, or null when the zone has no pH reading. */
  phRange?: PhRangeModel | null;
  /** Latest analysis summary. */
  summary: string | null;
  /** Latest macro recommended action. */
  action: string | null;
}

/**
 * Stacked active-zone sections: info, Calcium charts, pH range, insight,
 * observations, and search. Used by the server template and by Storybook
 * previews.
 *
 * @param {ZoneActiveTemplateProps} props - Component props.
 * @returns {React.ReactNode} The active zone layout.
 */
export function ZoneActiveTemplate({
  zoneName,
  sampleLabel,
  nextLabel,
  charts,
  phRange,
  summary,
  action,
}: ZoneActiveTemplateProps) {
  return (
    <div className="divide-foreground/10 mx-auto max-w-4xl divide-y px-6">
      <section className={ZONE_SECTION_CLASS}>
        <h2 className="text-foreground text-xl font-medium">{zoneName}</h2>
        <div className="mt-4 flex flex-wrap gap-x-12 gap-y-3 text-sm">
          <div>
            <span className="text-foreground/50">Sample </span>
            <span className="text-foreground">{sampleLabel}</span>
          </div>
          <div>
            <span className="text-foreground/50">Next </span>
            <span className="text-foreground">{nextLabel}</span>
          </div>
          <div>
            <span className="text-foreground/50">Lead Advisor </span>
            <span className="text-foreground">{LEAD_ADVISOR_PLACEHOLDER}</span>
          </div>
        </div>
      </section>

      {charts.length > 0 || phRange ? (
        <section className={ZONE_SECTION_CLASS}>
          <div className="flex flex-col gap-8">
            <ZoneMineralCharts charts={charts} />
            {phRange ? <ZonePhRange {...phRange} /> : null}
          </div>
        </section>
      ) : null}

      <ZoneInsight summary={summary} action={action} />

      <section className={ZONE_SECTION_CLASS}>
        <p className={HEADING_CLASS}>Observations</p>
        <button
          type="button"
          disabled
          className="border-foreground/20 text-foreground/50 mt-4 w-full rounded-md border border-dashed px-4 py-3 text-left text-sm"
        >
          + Add an observation to {zoneName}
        </button>
      </section>

      <section className={ZONE_SECTION_CLASS}>
        <label htmlFor="zone-search" className={HEADING_CLASS}>
          Ask about this zone
        </label>
        <ZoneSearchForm />
      </section>
    </div>
  );
}
