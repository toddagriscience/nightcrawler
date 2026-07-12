// Copyright © Todd Agriscience, Inc. All rights reserved.

import SocialLinks from '@/components/common/social-links/social-links';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import Link from 'next/link';

/**
 * Custom footer for the Todd go domain
 * @returns {JSX.Element} - The go domain footer component
 */
const GoFooter = async () => {
  'use cache';
  const legalLinks = [
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/accessibility', label: 'Accessibility' },
    { href: '/disclosures', label: 'Disclosures' },
    {
      href: 'https://toddagriscience.safebase.us/',
      label: 'Vulnerability Reporting',
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground font-light px-16 py-10 sm:mb-2 md:px-24 lg:px-36 xl:px-48">
      <div className="flex flex-col">
        <ToddHeader className="mb-20 md:text-4xl lg:text-5xl" />
        <p className="mb-8">© Todd Agriscience {currentYear}</p>
        <div className="mb-16 flex flex-col flex-wrap gap-6 items-start md:flex-row">
          {legalLinks.map((val) => (
            <Link key={val.href} href={val.href}>
              {val.label}
            </Link>
          ))}
        </div>
        <SocialLinks
          platforms={['x', 'instagram', 'linkedin', 'youtube', 'discord']}
          iconSize={20}
        />
      </div>
    </footer>
  );
};

export default GoFooter;
