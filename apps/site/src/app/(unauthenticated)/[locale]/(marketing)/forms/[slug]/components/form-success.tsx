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
        className="text-[32px]/[40px] font-normal text-foreground outline-none"
      >
        {successTitle}
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-foreground">
        {successMessage}
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-7 h-12 rounded-full border-foreground/50 px-6 text-base"
      >
        <Link href="/research">{t('successResearchLink')}</Link>
      </Button>
    </main>
  );
}
