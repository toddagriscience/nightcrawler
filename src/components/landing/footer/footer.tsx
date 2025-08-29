'use client';

import React from 'react';
import { Link } from '@/i18n/config';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/common';
import { FooterSection } from './types/footer';

/**
 * Footer component
 * @returns {JSX.Element} - The footer component
 */
const Footer = () => {
  const t = useTranslations('footer');

  const footerSections: FooterSection[] = [
    {
      title: t('sections.todd'),
      testId: 'todd-section-heading',
      links: [
        { href: '/', label: t('links.home') },
        { href: '/About', label: t('links.about') },
        { href: '/Offerings', label: t('links.offerings') },
        { href: '/Approach', label: t('links.approach') },
        { href: '/Impact', label: t('links.impact') },
        { href: '/News', label: t('links.news') },
        { href: '/Careers', label: t('links.careers') },
      ],
    },
    {
      title: t('sections.connect'),
      testId: 'connect-section-heading',
      links: [
        { href: '/contact', label: t('links.contact') },
        { href: '/Journal', label: t('links.journal') },
        {
          href: '/Investor Relations',
          label: t('links.investorRelations'),
        },
        { href: '/Foundation', label: t('links.foundation') },
        {
          href: 'https://instagram.com/toddagriscience',
          label: t('links.instagram'),
          external: true,
          testId: 'social-link-instagram',
        },
        {
          href: 'https://linkedin.com/company/toddagriscience',
          label: t('links.linkedin'),
          external: true,
          testId: 'social-link-linkedin',
        },
        {
          href: 'https://x.com/toddagriscience',
          label: t('links.x'),
          external: true,
          testId: 'social-link-x',
        },
      ],
    },
    {
      title: t('sections.legal'),
      testId: 'legal-section-heading',
      links: [
        {
          href: '/accessibility',
          label: t('links.accessibility'),
        },
        { href: '/privacy', label: t('links.privacy') },
        { href: '/terms', label: t('links.terms') },
        {
          href: 'https://toddagriscience.safebase.us',
          label: t('links.trustCenter'),
          external: true,
          testId: 'trust-center-link',
        },
      ],
    },
  ];

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
              {t('cta.letsTalk')}
            </h1>
            <Button
              href="/contact"
              text={t('cta.getInTouch')}
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
          {t('copyright', { year: new Date().getFullYear() })}
        </p>

        {/* Privacy link with icon */}
        <div className="mt-4 flex justify-center lg:justify-end">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-[#2A2727]/70 footer-underline transition-colors duration-300"
            data-testid="privacy-options-link"
          >
            {t('cta.privacyOptions')}
            <Image
              src="/privacyoptions.svg"
              alt={t('cta.privacyOptions')}
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
