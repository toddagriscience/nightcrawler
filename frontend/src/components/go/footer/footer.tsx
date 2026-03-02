// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import Link from 'next/link';
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

/**
 * Custom footer for the Todd go domain
 * @returns {JSX.Element} - The go domain footer component
 */
const GoFooter = () => {
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

  const socialMediaIcons = [
    {
      icon: <FaXTwitter aria-hidden="true" />,
      href: 'https://x.com/toddagriscience',
      ariaLabel: 'Visit our X (Twitter) page',
    },
    {
      icon: <FaInstagram aria-hidden="true" />,
      href: 'https://www.instagram.com/toddagriscience/',
      ariaLabel: 'Visit our Instagram page',
    },
    {
      icon: <FaLinkedinIn aria-hidden="true" />,
      href: 'https://www.linkedin.com/company/toddagriscience/',
      ariaLabel: 'Visit our LinkedIn page',
    },
    {
      icon: <FaYoutube aria-hidden="true" />,
      href: 'https://www.youtube.com/@toddagriscience',
      ariaLabel: 'Visit our YouTube channel',
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground font-light mt-8 mb-8 px-16 py-10 sm:mb-0 md:px-24 lg:px-36 xl:px-48">
      <div className="flex flex-col">
        <ToddHeader className="mb-20 [&_img]:w-[120px] [&_img]:h-auto" />
        <p className="mb-8">© Todd Agriscience {currentYear}</p>
        <div className="mb-16 flex flex-col flex-wrap gap-6 items-start md:flex-row">
          {legalLinks.map((val) => (
            <Link key={val.href} href={val.href}>
              {val.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-row flex-wrap gap-6">
          {socialMediaIcons.map((val) => (
            <Link key={val.href} href={val.href} aria-label={val.ariaLabel}>
              {val.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default GoFooter;
