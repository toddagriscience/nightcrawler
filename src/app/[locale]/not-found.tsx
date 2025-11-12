// Copyright Todd Agriscience, Inc. All rights reserved.

'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LocaleNotFound() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen flex items-end justify-start p-8 md:p-16 pb-16 md:pb-24 bg-[#F7F4EC]">
      <div className="flex flex-col md:flex-row items-end gap-8 md:gap-16 max-w-8xl">
        <div className="text-[120px] md:text-[240px] font-light leading-none text-[#555555] mb-4 md:mb-8">
          404
        </div>
        <div className="flex flex-col items-start gap-8 max-w-3xl">
          <p className="text-xl md:text-[32px] text-[#555555] font-light leading-normal">
            {t('notFound.message')}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#555555] text-white rounded-md hover:bg-[#444444] transition-colors"
          >
            {t('notFound.homeButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}
