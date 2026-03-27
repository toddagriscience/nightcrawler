// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import CookiePreferencesModal from '@/components/common/cookie-preferences-modal/cookie-preferences-modal';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Link } from '@/i18n/config';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const locale = useLocale();
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
      icon: <FaXTwitter aria-hidden="true" />,
      href: 'https://x.com/toddagriscience',
      ariaLabel: 'Visit our X (Twitter) page',
    },
    {
      icon: <FaYoutube aria-hidden="true" />,
      href: 'https://www.youtube.com/@toddagriscience',
      ariaLabel: 'Visit our YouTube channel',
    },
  ];

  const currentYear = new Date().getFullYear();

  const pathname = usePathname() || '/en';
  const [langOpen, setLangOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);

  const handleLocaleChange = (newLocale: string) => {
    setLangOpen(false);
    setPendingLocale(newLocale);
  };

  useEffect(() => {
    if (!pendingLocale) return;
    document.cookie = `NEXT_LOCALE=${pendingLocale};path=/;max-age=31536000`;
    const segments = pathname.split('/');
    segments[1] = pendingLocale;
    const newPath = segments.join('/') || `/${pendingLocale}`;
    window.location.assign(newPath);
  }, [pendingLocale, pathname]);

  return (
    <footer className="bg-background text-foreground font-light mt-8 mb-8 px-4 py-10 sm:mb-0 md:px-6 lg:px-12 xl:px-18">
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-col justify-between md:mb-16 md:flex-row">
          <ToddHeader className="md:text-4xl lg:text-5xl" />
          <div className="flex flex-row gap-32 max-md:mt-8 md:ml-auto">
            <div className="flex flex-col gap-4">
              {siteLinks.slice(0, 4).map((val) => (
                <Link
                  key={val.href}
                  href={val.href}
                  locale={locale}
                  className="text-base md:text-base"
                >
                  <span className="link text-underline-left text-underline-left-black text-black">
                    {val.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {siteLinks.slice(4, 8).map((val) => (
                <Link
                  key={val.href}
                  href={val.href}
                  locale={locale}
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
          <div className="relative inline-flex">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              className="flex flex-row items-center gap-4 cursor-pointer focus:outline-none focus:ring-0"
              aria-label="Change language"
            >
              <Image
                src="/united_states_flag.svg"
                alt=""
                width={50}
                height={50}
                className="h-6 w-6"
              />
              <span>{t('location')}</span>
            </button>

            {langOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-10"
                  onClick={() => setLangOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute left-0 bottom-full mb-2 w-full rounded bg-white p-1 text-black shadow-lg z-20"
                >
                  <button
                    onClick={() => handleLocaleChange('en')}
                    className="block w-full px-3 py-2 text-left text-sm cursor-pointer hover:bg-gray-100"
                    role="menuitem"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLocaleChange('es')}
                    className="block w-full px-3 py-2 text-left text-sm cursor-pointer hover:bg-gray-100"
                    role="menuitem"
                  >
                    Español
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <p>© Todd Agriscience {currentYear}</p>
        <div className="flex flex-col flex-wrap gap-6 items-start md:flex-row">
          {legalLinks.map((val) => (
            <Link key={val.href} href={val.href} locale={locale}>
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

export default Footer;
