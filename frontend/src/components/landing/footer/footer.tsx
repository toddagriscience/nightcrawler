// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Link } from '@/i18n/config';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

/**
 * Footer component
 * @returns {JSX.Element} - The footer component
 */
const Footer = () => {
  const t = useTranslations('footer');

  const siteLinks = [
    { href: '/who-we-are', label: t('links.whoWeAre') },
    { href: '/what-we-do', label: t('links.whatWeDo') },
    { href: '/news', label: t('links.news') },
    { href: '/careers', label: t('links.careers') },
    { href: '/contact', label: t('links.contact') },
    { href: '/investors', label: t('links.investors') },
    { href: '/sponsorships', label: t('links.sponsorships') },
    { href: '/foundation', label: t('links.foundation') },
  ];

  const legalLinks = [
    { href: '/terms', label: t('links.terms') },
    { href: '/privacy', label: t('links.privacy') },
    {
      href: '/accessibility',
      label: t('links.accessibility'),
    },
    { href: '/disclosures', label: t('links.disclosures') },
    {
      href: 'https://toddagriscience.safebase.us/',
      label: t('links.vulnReporting'),
    },
  ];

  const socialMediaIcons = [
    {
      icon: <FaInstagram role="img" />,
      href: 'https://www.instagram.com/toddagriscience/',
    },
    {
      icon: <FaLinkedinIn role="img" />,
      href: 'https://www.linkedin.com/company/toddagriscience/',
    },
    { icon: <FaXTwitter role="img" />, href: 'https://x.com/toddagriscience' },
    {
      icon: <FaYoutube role="img" />,
      href: 'http://www.youtube.com/@toddagriscience',
    },
  ];

  return (
    <footer className="mt-8 bg-background text-foreground py-10 px-4 md:px-6 lg:px-12 xl:px-18 mb-8 sm:mb-0">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col md:flex-row w-full justify-between md:mb-16">
          <ToddHeader />
          <div className="flex flex-row md:ml-auto gap-32 max-md:mt-8">
            <div className="flex flex-col gap-4">
              {siteLinks.slice(0, 4).map((val, index) => (
                <Link
                  key={index}
                  href={val.href}
                  className="md:text-xl text-lg"
                >
                  <span className="link text-underline-left text-underline-left-black text-black">
                    {val.label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {siteLinks.slice(4, 8).map((val, index) => (
                <Link
                  key={index}
                  href={val.href}
                  className="md:text-xl text-lg"
                >
                  <span className="link text-underline-left text-underline-left-black text-black">
                    {val.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-8">
        <div className="flex flex-row gap-4">
          <Image
            role="img"
            src={'/united_states_flag.png'}
            alt=""
            width={50}
            height={50}
            className="rounded-[50%] w-6 h-6"
          />
          <span>{t('location')}</span>
        </div>
        <p>© Todd Agriscience 2025</p>
        <div className="flex flex-row gap-6 flex-wrap">
          {legalLinks.map((val, index) => (
            <Link key={index} href={val.href}>
              {val.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-row gap-6 flex-wrap">
          {socialMediaIcons.map((val, index) => (
            <Link key={index} href={val.href}>
              {val.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
