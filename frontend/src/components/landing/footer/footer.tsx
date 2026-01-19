// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import CookiePreferencesModal from '@/components/common/cookie-preferences-modal/cookie-preferences-modal';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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
  const tCookiePreferences = useTranslations('cookiePreferences');

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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground font-light mt-8 mb-8 px-4 py-10 sm:mb-0 md:px-6 lg:px-12 xl:px-18">
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-col justify-between md:mb-16 md:flex-row">
          <ToddHeader className="md:text-4xl lg:text-5xl" />
          <div className="flex flex-row gap-32 max-md:mt-8 md:ml-auto">
            <div className="flex flex-col gap-4">
              {siteLinks.slice(0, 4).map((val, index) => (
                <Link
                  key={index}
                  href={val.href}
                  className="text-base md:text-base"
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
                  className="text-base md:text-base"
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
      <div className="mt-8 flex flex-col gap-10">
        <div className="flex flex-row gap-4">
          <Image
            role="img"
            src={'/united_states_flag.png'}
            alt=""
            width={50}
            height={50}
            className="h-6 w-6 rounded-[50%]"
          />
          <span>{t('location')}</span>
        </div>
        <p>© Todd Agriscience {currentYear}</p>
        <div className="flex flex-col flex-wrap gap-6 items-start md:flex-row">
          {legalLinks.map((val, index) => (
            <Link key={index} href={val.href}>
              {val.label}
            </Link>
          ))}
          <CookiePreferencesModal
            trigger={
              <div className="flex items-center gap-2">
                <span>{tCookiePreferences('managePreferences')}</span>
                <Image
                  alt=""
                  src={'/privacyoptions.svg'}
                  width={29}
                  height={14}
                />
              </div>
            }
          />
        </div>
        <div className="flex flex-row flex-wrap gap-6">
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
