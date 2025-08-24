'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common';

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

const footerSections: FooterSection[] = [
  {
    title: 'Todd',
    testId: 'todd-section-heading',
    links: [
      { href: '/', label: 'Home' },
      { href: '/About', label: 'About' },
      { href: '/Offerings', label: 'Offerings' },
      { href: '/Approach', label: 'Approach' },
      { href: '/Impact', label: 'Impact' },
      { href: '/News', label: 'News' },
      { href: '/Careers', label: 'Careers' },
    ],
  },
  {
    title: 'Connect',
    testId: 'connect-section-heading',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/Journal', label: 'Journal' },
      { href: '/Investor Relations', label: 'Investor Relations' },
      { href: '/Foundation', label: 'Foundation' },
      {
        href: 'https://instagram.com/toddagriscience',
        label: 'Instagram',
        external: true,
        testId: 'social-link-instagram',
      },
      {
        href: 'https://linkedin.com/company/toddagriscience',
        label: 'LinkedIn',
        external: true,
        testId: 'social-link-linkedin',
      },
      {
        href: 'https://x.com/toddagriscience',
        label: 'X',
        external: true,
        testId: 'social-link-x',
      },
    ],
  },
  {
    title: 'Legal',
    testId: 'legal-section-heading',
    links: [
      { href: '/accessibility', label: 'Accessibility' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      {
        href: 'https://toddagriscience.safebase.us',
        label: 'Trust Center',
        external: true,
        testId: 'trust-center-link',
      },
    ],
  },
];

const Footer = () => {
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
              Let&apos;s Talk
            </h1>
            <Button
              href="/contact"
              text="Get In Touch"
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
          © Todd Agriscience, Inc. {new Date().getFullYear()}
        </p>

        {/* Privacy link with icon */}
        <div className="mt-4 flex justify-center lg:justify-end">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-[#2A2727]/70 footer-underline transition-colors duration-300"
            data-testid="privacy-options-link"
          >
            Do Not Sell or Share My Data
            <Image
              src="/privacyoptions.svg"
              alt="Privacy"
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
