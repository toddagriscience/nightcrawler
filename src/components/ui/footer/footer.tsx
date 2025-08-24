'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, LoadingSpinner } from '@/components/common';
import { useLocale } from '@/context/LocaleContext';

// Footer navigation data structure
interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
  testId?: string;
}

interface FooterSection {
  title: string;
  testId: string;
  links: FooterLink[];
}

const Footer = () => {
  const { t, loadModule, isLoading } = useLocale();

  useEffect(() => {
    loadModule('navigation').catch(console.warn);
    loadModule('common').catch(console.warn);
  }, [loadModule]);

  const footerSections: FooterSection[] = [
    {
      title: t('navigation.footer.sections.todd'),
      testId: 'todd-section-heading',
      links: [
        { href: '/', label: t('navigation.footer.links.home') },
        { href: '/About', label: t('navigation.footer.links.about') },
        { href: '/Offerings', label: t('navigation.footer.links.offerings') },
        { href: '/Approach', label: t('navigation.footer.links.approach') },
        { href: '/Impact', label: t('navigation.footer.links.impact') },
        { href: '/News', label: t('navigation.footer.links.news') },
        { href: '/Careers', label: t('navigation.footer.links.careers') },
      ],
    },
    {
      title: t('navigation.footer.sections.connect'),
      testId: 'connect-section-heading',
      links: [
        { href: '/contact', label: t('navigation.footer.links.contact') },
        { href: '/Journal', label: t('navigation.footer.links.journal') },
        {
          href: '/Investor Relations',
          label: t('navigation.footer.links.investorRelations'),
        },
        { href: '/Foundation', label: t('navigation.footer.links.foundation') },
        {
          href: 'https://instagram.com/toddagriscience',
          label: t('navigation.footer.links.instagram'),
          external: true,
          testId: 'social-link-instagram',
        },
        {
          href: 'https://linkedin.com/company/toddagriscience',
          label: t('navigation.footer.links.linkedin'),
          external: true,
          testId: 'social-link-linkedin',
        },
        {
          href: 'https://x.com/toddagriscience',
          label: t('navigation.footer.links.x'),
          external: true,
          testId: 'social-link-x',
        },
      ],
    },
    {
      title: t('navigation.footer.sections.legal'),
      testId: 'legal-section-heading',
      links: [
        {
          href: '/accessibility',
          label: t('navigation.footer.links.accessibility'),
        },
        { href: '/privacy', label: t('navigation.footer.links.privacy') },
        { href: '/terms', label: t('navigation.footer.links.terms') },
        {
          href: 'https://toddagriscience.safebase.us',
          label: t('navigation.footer.links.trustCenter'),
          external: true,
          testId: 'trust-center-link',
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <footer className="bg-[#f8f5ee] text-[#2A2727] py-10 px-4 md:px-6 lg:px-12 xl:px-18">
        <div className="max-w-screen-2xl mx-auto flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#f8f5ee] text-[#2A2727] py-10 px-4 md:px-6 lg:px-12 xl:px-18">
      {/* Top section with Let's Talk and links */}
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
        {/* Let's Talk section */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div>
            <h1
              className="font-thin text-4xl md:text-5xl lg:text-6xl mb-6"
              data-testid="lets-talk-heading"
            >
              {t('navigation.footer.cta.letsTalk')}
            </h1>
            <Button
              href="/contact"
              text={t('navigation.footer.cta.getInTouch')}
              variant="outline"
              size="lg"
              isDark={false}
              data-testid="get-in-touch-button"
            />
          </div>
        </div>

        {/* Navigation links section */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <p
                className="font-semibold md:font-thin text-lg md:text-xl mb-4 md:mb-6 lg:mb-8"
                data-testid={section.testId}
              >
                {section.title}
              </p>
              <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-thin flex flex-col gap-2 md:gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="footer-underline duration-300 ease-in-out transition-all"
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    {...(link.testId && { 'data-testid': link.testId })}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright section */}
      <div className="max-w-screen-2xl mx-auto border-t border-[#2A2727]/10 pt-6">
        <p className="font-thin text-base md:text-lg text-center lg:text-right">
          {t('navigation.footer.copyright', { year: new Date().getFullYear() })}
        </p>

        {/* Privacy link with icon */}
        <div className="mt-4 flex justify-center lg:justify-end">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-[#2A2727]/70 footer-underline transition-colors duration-300"
            data-testid="privacy-options-link"
          >
            {t('navigation.footer.cta.privacyOptions')}
            <Image
              src="/privacyoptions.svg"
              alt={t('common.accessibility.privacy')}
              width={14}
              height={14}
              className="w-3.5 h-3.5"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
