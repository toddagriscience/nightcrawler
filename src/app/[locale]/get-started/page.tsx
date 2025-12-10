// Copyright Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitGetStartedForm } from './action';
import { PageHero } from '@/components/common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { FadeIn } from '@/components/common';

/**
 * Get Started page component - Contact form for prospective clients
 * @returns {JSX.Element} - The get started page
 */
export default function GetStartedPage() {
  const t = useTranslations('getStarted');

  interface FormData {
    fullName: string;
    email: string;
    company: string;
    interest: string;
    message: string;
  }

  const MAX_MESSAGE_LENGTH = 1500;

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    interest: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessfulSubmit, setIsSuccessfulSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      setError(
        `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
      };
      await submitGetStartedForm(submissionData);
      setIsSuccessfulSubmit(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccessfulSubmit) {
    return (
      <FadeIn>
        <section className="flex h-screen flex-col items-center justify-center bg-[#F7F4EC] px-6 text-center text-[#555555]">
          <h1 className="mb-6 text-[70px] leading-none font-light md:text-[110px]">
            {t('thankYou.title')}
          </h1>
          <p className="mb-8 max-w-2xl text-xl leading-relaxed font-light md:text-[24px]">
            {t('thankYou.content')}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#555555]/20 px-6 py-3 text-lg transition hover:bg-[#555555]/5"
          >
            {t('thankYou.homeLink')} <span>→</span>
          </Link>
        </section>
      </FadeIn>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Form Section */}
      <div className="text-foreground mb-16 min-h-screen bg-[#F7F4EC] p-8 md:p-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-foreground/60 mb-16 text-xl font-[200]">
            {t('description')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-16">
            {error && (
              <div className="rounded-md border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-[200] text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-foreground/80 text-xl font-[200]"
              >
                {t('form.nameLabel')}
              </label>
              <input
                id="fullName"
                type="text"
                data-testid="name-input"
                required
                className="border-foreground/20 w-full border-b bg-transparent py-2 text-xl font-[200] transition-colors focus:border-[#2A2727]/40 focus:outline-none"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
              <p className="text-foreground/40 text-sm font-[200]">
                * {t('form.required')}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-foreground/80 text-xl font-[200]"
              >
                {t('form.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                data-testid="email-input"
                required
                className="border-foreground/20 w-full border-b bg-transparent py-2 text-xl font-[200] transition-colors focus:border-[#2A2727]/40 focus:outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <p className="text-foreground/40 text-sm font-[200]">
                * {t('form.required')}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="company"
                className="text-foreground/80 text-xl font-[200]"
              >
                {t('form.companyLabel')}
              </label>
              <input
                id="company"
                type="text"
                data-testid="company-input"
                className="border-foreground/20 w-full border-b bg-transparent py-2 text-xl font-[200] transition-colors focus:border-[#2A2727]/40 focus:outline-none"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
              />
            </div>

            <div className="relative space-y-2">
              <label
                htmlFor="interest"
                className="text-foreground/80 text-xl font-[200]"
              >
                {t('form.interestLabel')}
              </label>
              <Select
                required
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, interest: value }))
                }
              >
                <SelectTrigger className="border-foreground/20 mt-4 rounded-none border-b pr-0 text-xl font-light">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-background border-foreground/20 text-lg">
                  <SelectItem
                    className="opacity-80 transition hover:opacity-100"
                    value="regenerativeAgriculture"
                  >
                    {t('interestOptions.regenerativeAgriculture')}
                  </SelectItem>

                  <SelectItem
                    value="farmManagement"
                    className="opacity-80 transition hover:opacity-100"
                  >
                    {t('interestOptions.farmManagement')}
                  </SelectItem>

                  <SelectItem
                    value="consumerEngagement"
                    className="opacity-80 transition hover:opacity-100"
                  >
                    {t('interestOptions.consumerEngagement')}
                  </SelectItem>

                  <SelectItem
                    value="partnership"
                    className="opacity-80 transition hover:opacity-100"
                  >
                    {t('interestOptions.partnership')}
                  </SelectItem>

                  <SelectItem
                    value="other"
                    data-testid="other"
                    className="opacity-80 transition hover:opacity-100"
                  >
                    {t('interestOptions.other')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-foreground/40 text-sm font-[200]">
                * {t('form.required')}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-foreground/80 text-xl font-[200]"
              >
                {t('form.messageLabel')}
              </label>
              <textarea
                id="message"
                data-testid="message-input"
                required
                rows={6}
                className="border-foreground/20 w-full resize-none border-b bg-transparent py-2 text-xl font-[200] transition-colors focus:border-[#2A2727]/40 focus:outline-none"
                value={formData.message}
                onChange={(e) => {
                  const message = e.target.value;
                  if (message.length <= MAX_MESSAGE_LENGTH) {
                    setFormData((prev) => ({ ...prev, message: message }));
                  }
                }}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <p className="text-foreground/40 text-sm font-[200]">
                * {t('form.required')}
                <span className="text-foreground/60">
                  {' '}
                  ({formData.message.length}/{MAX_MESSAGE_LENGTH} characters)
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-foreground/80 group flex items-center gap-2 text-xl font-[200] transition-colors hover:cursor-pointer hover:text-[#2A2727] disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? t('form.inProgressSubmit')
                  : t('form.submitButton')}
              </span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
