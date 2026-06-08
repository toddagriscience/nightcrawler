// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import ContactLinksSection from './components/contact-links-section';

/**
 * Contact page providing access to support tools including email and SMS contact options.
 * Warm, human-centered design for a farm services company.
 */
export default function ContactPage() {
  return (
    <main className="w-full">
      {/* Page header with back navigation */}
      <header className="border-b border-[var(--border-subtle)]">
        <div className="flex w-full max-w-3xl items-center gap-6 px-8 py-8">
          <Link
            href="/"
            className="text-[var(--foreground-muted)] inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          >
            <BiArrowBack className="size-4" />
            <span>Home</span>
          </Link>
          <h1 className="text-[var(--foreground)] text-3xl font-light tracking-tight">
            Support Tools
          </h1>
        </div>
      </header>

      {/* Support action buttons */}
      <section className="max-w-3xl px-8 py-10">
        <p className="text-[var(--foreground-secondary)] text-sm mb-6 leading-relaxed">
          Need help? Reach out to our team directly — we&apos;re here for you.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:service.us@toddagriscience.com"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-[var(--foreground)] text-[var(--background)] rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--foreground)]/10 active:translate-y-0"
          >
            <Mail className="size-4" />
            <span>Email Us</span>
          </a>

          <a
            href="tel:+18882791283"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-[var(--card)] text-[var(--card-foreground)] rounded-full text-sm font-medium transition-all border border-[var(--border-subtle)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--card)]/30 active:translate-y-0"
          >
            <MessageCircle className="size-4" />
            <span>Send SMS</span>
          </a>
        </div>

        <ContactLinksSection />
      </section>
    </main>
  );
}
