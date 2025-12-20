// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/config';

export default function LocaleNotFound() {
  const t = useTranslations('common');

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
      <h1 className="mb-8 text-4xl text-center">{t('notFound.title')}</h1>

      <p className="text-center">
        {t.rich('notFound.message', {
          home: (chunks) => (
            <Link
              href="/"
              className="underline underline-offset-4 hover:opacity-80"
            >
              {chunks}
            </Link>
          ),
          news: (chunks) => (
            <Link
              href="/news"
              className="underline underline-offset-4 hover:opacity-80"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
