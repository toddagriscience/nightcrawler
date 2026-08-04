// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';

const legalItems: { label: string; href?: string }[] = [
  { label: 'Todd App Use Standards' },
  { label: 'Todd Business Continuity Plan Summary' },
  { label: 'Todd Platform Advisory Agreement' },
  { label: 'Todd Platform Disclosure' },
  { label: 'Todd Privacy Policy', href: '/privacy' },
  { label: 'Todd Terms of Use', href: '/terms' },
  { label: 'Todd Third-Party Business Conduct Policy' },
  { label: 'Todd User Account Agreement' },
];

/**
   
  Legal library page displaying legal document titles.
  @returns {JSX.Element} The rendered legal page*/
export default function LegalPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-[146px] pb-20 sm:px-12 lg:px-0">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <h1 className="lg:ml-[216px] lg:-mt-[36px] text-[48px] font-normal leading-[56px]">
            Legal
            <br />
            Library
          </h1>

          <ul className="lg:ml-[170px] max-w-[385px] flex flex-col gap-[15px] text-[16px] font-normal leading-[18px]">
            {legalItems.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="link text-underline-left text-underline-left-black"
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
