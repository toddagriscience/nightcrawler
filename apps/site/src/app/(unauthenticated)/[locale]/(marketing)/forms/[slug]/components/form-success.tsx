// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import type { FormSuccessProps } from './types';

/** Accessible confirmation shared by contact and CMS request forms. */
export function FormSuccess({ title, message }: FormSuccessProps) {
  const t = useTranslations('formsPage');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Existing Sanity forms contain the old seeded defaults. Localize those
  // through next-intl while preserving deliberately customized CMS copy.
  const successTitle =
    !title?.trim() || title === 'Request received'
      ? t('defaultSuccessTitle')
      : title;
  const successMessage =
    !message?.trim() ||
    message ===
      'Thank you. Our team will review your request and follow up by email.'
      ? t('defaultSuccessMessage')
      : message;

  return (
    <main className="flex min-h-[calc(100svh-88px)] w-full flex-col items-center justify-center px-6 py-16 text-center">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[28px]/[32px] font-normal"
      >
        {successTitle}
      </h1>
      <p className="mt-4 mb-6 max-w-sm text-[14px]/[24px]">{successMessage}</p>
      <Button
        asChild
        variant="outline"
        className="rounded-full border-[0.75px] border-[#848484] text-sm w-[160px] h-[42px]"
        size="lg"
      >
        <Link href="/research">{t('successResearchLink')}</Link>
      </Button>
    </main>
  );
}
