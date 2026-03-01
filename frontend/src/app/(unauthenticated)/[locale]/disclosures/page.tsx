import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

type LinkItem = { label: string; href: string };
type LinkSections = {
  primaryLinks: LinkItem[];
  subLinks: LinkItem[];
};

function LinkList({ linkItem }: { linkItem: LinkSections }) {
  return (
    <ul className="mt-1 space-y-2">
      {Object.entries(linkItem).map(([section, refLinks]) => (
        <li key={section} className="underline mb-8 flex flex-col gap-2">
          {refLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:opacity-70 transition duration-200"
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
    primaryLinks: [
      { label: t('links.general.privacyEnglish'), href: '#' },
      { label: t('links.general.privacyEU'), href: '#' },
      { label: t('links.general.privacyJapan'), href: '#' },
    ],

    subLinks: [{ label: t('links.general.misuseNameBrand'), href: '#' }],
  };

  const ukLinks = [{ label: t('links.uk.modernSlavery'), href: '#' }];

  return (
    <main className="h-[90vh] mx-auto my-3 max-w-5xl px-6 py-14">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-medium">{t('title.general')}</h1>
        <LinkList linkItem={generalLinks} />
      </div>
      <div>
        <h1 className="mb-8 text-4xl font-medium">{t('title.uk')}</h1>
        <ul className="space-y-2">
          {ukLinks.map((link) => (
            <li
              key={link.label}
              className="underline hover:opacity-70 transition duration-200"
            >
              <Link href={link.href} className="">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
