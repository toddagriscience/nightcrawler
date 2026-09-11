// Copyright © Todd Agriscience, Inc. All rights reserved.

import { DynamicForm } from '@/app/(unauthenticated)/[locale]/(marketing)/forms/[slug]/components/dynamic-form';
import { getFormBySlug } from '@/lib/sanity/forms';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

/** Sanity slug for the public contact form. */
const CONTACT_FORM_SLUG = 'contact';

/**
 * Contact page rendered from the Sanity form builder.
 */
export default async function Contact() {
  const form = await getFormBySlug(CONTACT_FORM_SLUG, {
    next: { revalidate: 60 * 60 },
  });

  if (!form) {
    notFound();
  }

  const t = await getTranslations('formsPage');

  return (
    <DynamicForm
      form={form}
      title={t('contactTitle')}
      subtitle={t('contactSubtitle')}
    />
  );
}

/** Metadata for the public contact page. */
export const metadata: Metadata = {
  title: 'Contact',
};
