// Copyright © Todd Agriscience, Inc. All rights reserved.

import { DynamicForm } from '@/app/(unauthenticated)/[locale]/(marketing)/forms/[slug]/components/dynamic-form';
import { getFormBySlug } from '@/lib/sanity/forms';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * CMS-driven access request form at `/forms/[slug]`.
 *
 * @param params - Dynamic slug segment
 */
export default async function FormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);

  if (!form) {
    notFound();
  }

  return <DynamicForm form={form} />;
}

/**
 * Generates page metadata from the Sanity form title.
 *
 * @param params - Dynamic slug segment
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const form = await getFormBySlug(slug);

  if (!form) {
    return { title: 'Form not found' };
  }

  return {
    title: form.title,
    robots: { index: false, follow: false },
  };
}
