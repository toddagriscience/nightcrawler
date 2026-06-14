// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildFormSubmissionHydrationPreview } from '@nightcrawler/db/utils/preview-form-submission-hydration';
import type { FormSubmissionHydrationPreviewRow } from '@nightcrawler/db/utils/preview-form-submission-hydration';

/** Props for {@link ApplicationAnswersPanel}. */
export interface ApplicationAnswersPanelProps {
  /** Sanity form slug */
  formSlug: string;
  /** Stored submission answers */
  answers: Record<string, unknown>;
}

/**
 * Formats one stored answer value for the standard answers list.
 *
 * @param value - Raw answer value
 */
function formatAnswerValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value ?? '');
}

/**
 * Formats one preview value for the technical DB mapping table.
 *
 * @param value - Mapped value
 */
function formatPreviewValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

/** Human-readable label for hydration preview timing. */
const TIMING_LABELS: Record<FormSubmissionHydrationPreviewRow['when'], string> =
  {
    on_submit: 'On submit',
    on_signup_prefill: 'On signup (user prefill)',
    on_signup_hydration: 'On signup (farm hydration)',
    not_hydrated: 'Not hydrated',
  };

/**
 * Standard and technical answer views for one platform-access application.
 *
 * @param props - Form slug and stored answers
 */
export default function ApplicationAnswersPanel({
  formSlug,
  answers,
}: ApplicationAnswersPanelProps) {
  const preview = useMemo(
    () => buildFormSubmissionHydrationPreview({ formSlug, answers }),
    [formSlug, answers]
  );

  const hydrationRows = preview.rows.filter((row) => row.when !== 'on_submit');
  const jsonText = useMemo(() => JSON.stringify(answers, null, 2), [answers]);

  return (
    <Tabs defaultValue="standard" className="space-y-3">
      <TabsList>
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
      </TabsList>

      <TabsContent value="standard" className="space-y-3 rounded-md border p-4">
        <h2 className="text-sm font-medium">Answers</h2>
        {Object.keys(answers).length === 0 ? (
          <p className="text-sm text-muted-foreground">No answers stored.</p>
        ) : (
          Object.entries(answers).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">{key}</div>
              <div className="col-span-2 break-words whitespace-pre-wrap">
                {formatAnswerValue(value)}
              </div>
            </div>
          ))
        )}
      </TabsContent>

      <TabsContent value="technical" className="space-y-3">
        <Tabs defaultValue="json">
          <TabsList>
            <TabsTrigger value="json">Raw JSON</TabsTrigger>
            <TabsTrigger value="hydration">DB mapping preview</TabsTrigger>
          </TabsList>

          <TabsContent
            value="json"
            className="rounded-md border bg-muted/30 p-4"
          >
            <p className="mb-3 text-xs text-muted-foreground">
              Exact `form_submissions.answers` payload stored on public submit.
            </p>
            <pre className="overflow-x-auto text-xs leading-relaxed">
              <code>{jsonText}</code>
            </pre>
          </TabsContent>

          <TabsContent
            value="hydration"
            className="space-y-3 rounded-md border p-4"
          >
            <p className="text-xs text-muted-foreground">
              Approve only sets status and sends the signup email. Farm tables
              are written when the applicant completes signup — this preview
              shows what hydration would upsert from the current answers JSON.
            </p>

            {!preview.hydratesFarm ? (
              <p className="text-sm text-muted-foreground">
                Form slug `{formSlug}` does not participate in farm hydration.
              </p>
            ) : hydrationRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No signup hydration rows for this submission.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">When</th>
                      <th className="py-2 pr-3 font-medium">Source key(s)</th>
                      <th className="py-2 pr-3 font-medium">Table</th>
                      <th className="py-2 pr-3 font-medium">Column</th>
                      <th className="py-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hydrationRows.map((row, index) => (
                      <tr
                        key={`${row.when}-${row.table}-${row.column}-${row.sourceKeys}-${index}`}
                        className="border-b align-top last:border-b-0"
                      >
                        <td className="py-2 pr-3 whitespace-nowrap text-xs">
                          {TIMING_LABELS[row.when]}
                        </td>
                        <td className="py-2 pr-3 font-mono text-xs break-all">
                          {row.sourceKeys}
                        </td>
                        <td className="py-2 pr-3 font-mono text-xs">
                          {row.table}
                        </td>
                        <td className="py-2 pr-3 font-mono text-xs">
                          {row.column}
                        </td>
                        <td className="py-2 font-mono text-xs whitespace-pre-wrap break-all">
                          {formatPreviewValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
