// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { db } from '@nightcrawler/db/schema/connection';
import { generalImp } from '@nightcrawler/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { ImpMarkdown } from '../../[slug]/components/imp-markdown';

/**
 * Read-only detail page for a general Integrated Management Practice, the
 * search destination for `general-imp` results. Unlike the plan-IMP page this
 * has no per-user notes — general IMPs are a shared reference mirror.
 */
export default async function GeneralImpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await getAuthenticatedInfo();

  const { slug } = await params;

  const [imp] = await db
    .select({
      title: generalImp.title,
      tags: generalImp.tags,
      triggerRaw: generalImp.triggerRaw,
      content: generalImp.content,
    })
    .from(generalImp)
    .where(eq(generalImp.slug, slug))
    .limit(1);

  if (!imp) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <Link
          href="/"
          className="text-foreground/70 hover:text-foreground inline-flex items-center gap-2 text-sm font-light transition-colors"
        >
          <HiArrowLongLeft className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <article className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 border-b border-stone-200 pb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium uppercase text-emerald-800">
              IMP
            </span>
            {imp.tags.map((tag) => (
              <span
                key={tag}
                className="text-foreground/70 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            {imp.title ?? 'Integrated Management Practice'}
          </h1>
          {imp.triggerRaw && (
            <p className="text-foreground/50 mt-3 text-sm">
              Applies when: <code>{imp.triggerRaw}</code>
            </p>
          )}
        </div>

        <ImpMarkdown content={imp.content} />
      </article>
    </div>
  );
}
