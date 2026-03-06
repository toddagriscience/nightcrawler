// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import type { LinkSections } from './types';
import { getTranslations } from 'next-intl/server';

function LinkList({ linkItem }: { linkItem: LinkSections }) {
  return (
    <ul className="mt-1 space-y-2">
      {Object.entries(linkItem).map(([section, refLinks]) => (
        <li key={section} className="underline mb-8 flex flex-col gap-2">
          {refLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition duration-300"
            >
              {link.label}
            </Link>
          ))}
        </li>
      ))}
    </ul>
  );
}

export default async function DisclosuresPage() {
  const t = await getTranslations('disclosures');

  const generalLinks: LinkSections = {
    primaryLinks: [{ label: t('links.general.privacy'), href: '/privacy' }],

    subLinks: [
      {
        label: t('links.general.misuseNameBrand'),
        href: '/name_brand_identity_misues.pdf',
      },
    ],
  };

  const ukLinks = [
    {
      label: t('links.uk.modernSlavery'),
      href: '/modern_slavery_act_statement.pdf',
    },
  ];

  return (
    <main className="font-thin h-[90vh] mx-auto my-3 max-w-5xl px-8 py-14">
      <div className="mb-12">
        <h1 className="mb-10 text-4xl">{t('title.general')}</h1>
        <LinkList linkItem={generalLinks} />
      </div>
      <div>
        <h1 className="mb-10 text-4xl">{t('title.uk')}</h1>
        <ul className="space-y-2">
          {ukLinks.map((link) => (
            <li
              key={link.label}
              className="underline hover:opacity-70 transition duration-200"
            >
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
