// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import CookiePreferencesModal from '@/components/common/cookie-preferences-modal/cookie-preferences-modal';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Link } from '@/i18n/config';
import { useLocale, useTranslations } from 'next-intl';
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

  const footerSections = [
    {
      title: t('sections.todd'),
      links: [
        { href: '/research', label: t('links.research') },
        { href: '/about', label: t('links.about') },
        { href: '/careers', label: t('links.careers') },
        { href: '/news', label: t('links.news') },
      ],
    },
    {
      title: t('sections.termsAndPolicies'),
      links: [
        { href: '/terms', label: t('links.terms') },
        { href: '/privacy', label: t('links.privacy') },
        { href: '/accessibility', label: t('links.accessibility') },
        { href: '/legal', label: t('links.legal') },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  const pathname = usePathname() || '/';
  const [langOpen, setLangOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const currentLanguageLabel = locale === 'es' ? 'Español' : 'English';

  const trimPath = (p: string) => p.replace(/\/+$/, '') || '/';

  const handleLocaleChange = (newLocale: string) => {
    setLangOpen(false);
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    if (trimPath(newPath) === trimPath(pathname)) {
      return;
    }
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
          <ToddHeader className="md:text-4xl lg:text-5xl" localeAware />
          <div className="grid grid-cols-1 gap-y-8 max-md:mt-8 sm:grid-cols-2 sm:gap-x-16 md:ml-auto md:gap-x-32">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h2 className="text-base font-light text-foreground/50">
                  {section.title}
                </h2>
                {section.links.map((val) => (
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
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-6 border-t border-foreground/10 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10">
          <p>Todd Agriscience © 2018-{currentYear}</p>
          <CookiePreferencesModal
            trigger={
              <span className="underline underline-offset-4">
                {tCookiePreferences('manageCookies')}
              </span>
            }
          />
        </div>
        <div className="flex flex-wrap items-center gap-8 md:justify-end">
          {socialMediaIcons.map((val) => (
            <Link key={val.href} href={val.href} aria-label={val.ariaLabel}>
              {val.icon}
            </Link>
          ))}
          <div className="relative inline-flex">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              className="flex flex-row items-center gap-3 cursor-pointer focus:outline-none focus:ring-0 md:gap-6"
              aria-label="Change language"
            >
              <span className="font-normal">{currentLanguageLabel}</span>
              <span className="text-foreground/50">{t('location')}</span>
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
                  className="absolute right-0 bottom-full mb-2 w-40 rounded bg-white p-1 text-black shadow-lg z-20"
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
      </div>
    </footer>
  );
};

export default Footer;
