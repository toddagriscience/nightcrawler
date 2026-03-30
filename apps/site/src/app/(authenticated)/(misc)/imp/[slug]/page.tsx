// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { db } from '@nightcrawler/db/schema/connection';
import { integratedManagementPlanNote } from '@nightcrawler/db/schema';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { ImpMarkdown } from './components/imp-markdown';
import { ImpNotesForm } from './components/imp-notes-form';
import { getImpArticleBySlug } from './utils';

export default async function ImpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const currentUser = await getAuthenticatedInfo();

  if (!currentUser.approved) {
    notFound();
  }

  const { slug } = await params;

  const article = await getImpArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [note] = await db
    .select({
      notes: integratedManagementPlanNote.notes,
      updatedAt: integratedManagementPlanNote.updatedAt,
    })
    .from(integratedManagementPlanNote)
    .where(
      and(
        eq(integratedManagementPlanNote.integratedManagementPlanId, article.id),
        eq(integratedManagementPlanNote.userId, currentUser.id)
      )
    )
    .limit(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-light text-foreground/70 transition-colors hover:text-foreground"
        >
          <HiArrowLongLeft className="size-5" />
          Back to search
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 border-b border-stone-200 pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium uppercase text-emerald-800">
                IMP
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-foreground/70">
                {article.category}
              </span>
              {article.source && (
                <span className="text-sm text-foreground/50">
                  Source: {article.source}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {article.title}
            </h1>
          </div>

          <ImpMarkdown content={article.content} />
        </article>

        <aside className="h-max">
          <div className="fixed">
            <ImpNotesForm
              articleId={article.id}
              initialNotes={note?.notes ?? ''}
              initialUpdatedAt={note?.updatedAt?.toISOString() ?? null}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
