'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#2A2727] text-lg md:text-xl lg:text-2xl px-5 py-2 hover:bg-[#2A2727] hover:text-[#FDFDFB] duration-300 ease-in-out transition-all"
              data-testid="get-in-touch-link"
            >
              Get In Touch{' '}
              <ArrowRight color="currentColor" className="text-2xl" />
            </Link>
          </div>
        </div>

        {/* Navigation links section */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
          {/* Todd links */}
          <div className="flex flex-col">
            <p
              className="font-semibold md:font-thin text-lg md:text-xl mb-4 md:mb-6 lg:mb-8"
              data-testid="todd-section-heading"
            >
              Todd
            </p>
            <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-thin flex flex-col gap-2 md:gap-3">
              <Link
                href="/"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Home
              </Link>
              <Link
                href="/who-we-are"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                About
              </Link>
              <Link
                href="/what-we-do"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                What We Do
              </Link>
              <Link
                href="/news"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                News
              </Link>
              <Link
                href="/careers"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Connect links */}
          <div className="flex flex-col">
            <p
              className="font-semibold md:font-thin text-lg md:text-xl mb-4 md:mb-6 lg:mb-8"
              data-testid="connect-section-heading"
            >
              Connect
            </p>
            <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-thin flex flex-col gap-2 md:gap-3">
              <Link
                href="/contact"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Contact
              </Link>
              <Link
                href="/investors"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Investor Relations
              </Link>
              <Link
                href="https://instagram.com/toddagriscience"
                className="footer-underline duration-300 ease-in-out transition-all"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-link-instagram"
              >
                Instagram
              </Link>
              <Link
                href="https://linkedin.com/company/toddagriscience"
                className="footer-underline duration-300 ease-in-out transition-all"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-link-linkedin"
              >
                LinkedIn
              </Link>
              <Link
                href="https://x.com/toddagriscience"
                className="footer-underline duration-300 ease-in-out transition-all"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-link-x"
              >
                X
              </Link>
            </div>
          </div>

          {/* Legal links */}
          <div className="flex flex-col">
            <p
              className="font-semibold md:font-thin text-lg md:text-xl mb-4 md:mb-6 lg:mb-8"
              data-testid="legal-section-heading"
            >
              Legal
            </p>
            <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-thin flex flex-col gap-2 md:gap-3">
              <Link
                href="/accessibility"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Accessibility
              </Link>
              <Link
                href="/privacy"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="footer-underline duration-300 ease-in-out transition-all"
              >
                Terms
              </Link>
              <Link
                href="https://toddagriscience.safebase.us"
                className="footer-underline duration-300 ease-in-out transition-all"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="trust-center-link"
              >
                Trust Center
              </Link>
            </div>
          </div>
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
