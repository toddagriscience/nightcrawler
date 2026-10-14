// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { getGeneralImps } from '@/app/(dashboard)/imps/catalog/actions';
import { groupGeneralImps } from '@/app/(dashboard)/imps/catalog/utils';
import type { GeneralImp } from '@/app/(dashboard)/imps/catalog/types';
import { CatalogEditor } from './catalog-editor';

/** General IMP administration, with comparable ranges and a source-sync reminder. */
export function CatalogClient({ initialImps }: { initialImps: GeneralImp[] }) {
  const [imps, setImps] = useState(initialImps);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<GeneralImp | null | undefined>();
  const [exporting, setExporting] = useState(false);
  const reload = async () => {
    try {
      setImps(await getGeneralImps());
    } catch {
      toast.error('Unable to reload the catalog.');
    }
  };
  const filtered = imps.filter((imp) =>
    [imp.title, imp.slug, imp.content, imp.triggerRaw, ...imp.tags]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const groups = groupGeneralImps(filtered);
  const exportSnapshot = async () => {
    setExporting(true);
    try {
      const rows = await getGeneralImps();
      const blob = new Blob([JSON.stringify(rows, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'general-imps-snapshot.json';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Unable to export the catalog.');
    } finally {
      setExporting(false);
    }
  };
  const card = (imp: GeneralImp) => (
    <article key={imp.id} className="space-y-3 rounded border p-4">
      <h4 className="font-semibold">
        {imp.title || imp.tags.join(', ') || imp.slug}
      </h4>
      <p className="text-xs break-words text-muted-foreground">
        {imp.slug} · {imp.tags.join(', ') || 'No tags'}
      </p>
      <p className="text-sm">
        {imp.triggerRaw ? (
          <>
            Trigger: <code>{imp.triggerRaw}</code>
          </>
        ) : (
          'Reference concept (no trigger)'
        )}
      </p>
      <div className="prose prose-sm max-w-none break-words">
        <ReactMarkdown>{imp.content}</ReactMarkdown>
      </div>
      <p className="text-xs text-muted-foreground">
        Last edited: {new Date(imp.updatedAt).toLocaleString()}
      </p>
      <Button
        variant="outline"
        onClick={() => setEditing(imp)}
        aria-label={`Edit ${imp.slug}`}
      >
        Edit
      </Button>
    </article>
  );
  return (
    <div className="space-y-6">
      <Link href="/imps" className="underline underline-offset-4">
        Farm-specific plans
      </Link>
      <PageHeader
        title="General IMP catalog"
        description="Imported practices, reference concepts and advice by range."
        onSearch={setQuery}
        searchPlaceholder="Search headings, tags, triggers or body…"
      />
      <div className="rounded border p-4 space-y-2 text-sm">
        <p>
          The spreadsheet is the source of truth. Dashboard edits are live;
          reconcile them with the spreadsheet before importing again. Imports
          may overwrite edits or prune new rows.
        </p>
        <details>
          <summary className="cursor-pointer font-medium">
            Operator import workflow
          </summary>
          <ol className="list-decimal pl-5 space-y-2 mt-3">
            <li>
              Review and edit the source tab, keeping column A blank, then
              Category, Trigger, Title and Body.
            </li>
            <li>
              Export that tab as CSV to{' '}
              <code>packages/db/data/general-imps.csv</code>.
            </li>
            <li>
              From <code>packages/db</code>, run{' '}
              <code>bun run db:import-imps</code> for a dry run, then use{' '}
              <code>--commit</code> only on the intended local database.
            </li>
            <li>
              For managed targets, follow{' '}
              <code>packages/db/docs/general-imps.md</code>. Remote writes
              require explicit target confirmation and real embeddings. Review
              pruning before applying.
            </li>
            <li>
              Reload this catalog and check range groups, bodies and client
              links. Export a snapshot before reconciling dashboard changes.
            </li>
          </ol>
          <p className="mt-3">
            Range columns are a display grouping, not an agronomic trigger
            evaluator.
          </p>
        </details>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setEditing(null)}>New general IMP</Button>
        <Button variant="outline" onClick={reload}>
          Reload catalog
        </Button>
        <Button variant="outline" onClick={exportSnapshot} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export catalog snapshot'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {filtered.length} of {imps.length} practices
      </p>
      {filtered.length === 0 && (
        <p>
          No general IMPs found. Import the source spreadsheet or create a
          practice.
        </p>
      )}
      {groups.ranges.map((group) => (
        <section
          key={JSON.stringify([group.subject, group.tags])}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">
            {group.subject}{' '}
            {group.tags.length > 0 && (
              <span className="text-sm font-normal">
                · {group.tags.join(', ')}
              </span>
            )}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {(['low', 'ideal', 'high'] as const).map((range) => (
              <div key={range} className="space-y-3">
                <h3 className="capitalize font-semibold">{range}</h3>
                {group[range].length ? (
                  group[range].map(card)
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No {range} practice.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      {groups.other.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Reference concepts and other triggers
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {groups.other.map(card)}
          </div>
        </section>
      )}
      {editing !== undefined && (
        <CatalogEditor
          imp={editing}
          onClose={() => setEditing(undefined)}
          onSaved={reload}
        />
      )}
    </div>
  );
}
