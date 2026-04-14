// Copyright © Todd Agriscience, Inc. All rights reserved.

import PageHeader from '@/components/common/page-header/page-header';
import SectionContent, {
  mapSectionTextParagraphs,
} from '@/components/common/section-content/section-content';
import { Link } from '@/i18n/config';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import HowToUseWordmark from './components/how-to-use-wordmark/how-to-use-wordmark';
import WordmarkImage from './components/wordmark-image/wordmark-image';

const TERMS_OF_USE = 'Terms of Use';
const BRAND_EMAIL = 'brand@todd.com';

/**
 * Linkifies "Terms of Use" and email addresses in the usage-terms paragraph.
 * All other paragraphs render as plain text.
 */
function renderUsageTermsParagraph(body: string, index: number): ReactNode {
  if (index !== 0) {
    return linkifyEmail(body);
  }
  const touIdx = body.indexOf(TERMS_OF_USE);
  if (touIdx === -1) {
    return linkifyEmail(body);
  }
  const before = body.slice(0, touIdx);
  const after = body.slice(touIdx + TERMS_OF_USE.length);
  return (
    <>
      {linkifyEmail(before)}
      <Link href="/terms" className="underline underline-offset-2">
        {TERMS_OF_USE}
      </Link>
      {linkifyEmail(after)}
    </>
  );
}

/** Replaces `brand@todd.com` with a `mailto:` link. Returns the string unchanged if absent. */
function linkifyEmail(text: string): ReactNode {
  const idx = text.indexOf(BRAND_EMAIL);
  if (idx === -1) {
    return text;
  }
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={`mailto:${BRAND_EMAIL}`}
        className="underline underline-offset-2"
      >
        {BRAND_EMAIL}
      </a>
      {text.slice(idx + BRAND_EMAIL.length)}
    </>
  );
}

/**
 * @returns {Promise<JSX.Element>} - The brand page
 */
export default async function BrandPage() {
  const t = await getTranslations('brand');
  const messages = await getMessages();
  const intro = messages.brand?.sectionContent?.intro as
    | { title?: string; text?: Record<string, string> }
    | undefined;
  const logo = messages.brand?.sectionContent?.logo as
    | {
        title?: string;
        subtitle?: string;
        text?: Record<string, string>;
        caption?: string;
      }
    | undefined;
  const brandPartnerships = messages.brand?.sectionContent
    ?.brandPartnerships as
    | { title?: string; text?: Record<string, string> }
    | undefined;
  const pressReleases = messages.brand?.sectionContent?.pressReleases as
    | { title?: string; text?: Record<string, string> }
    | undefined;
  const usageTerms = messages.brand?.sectionContent?.usageTerms as
    | { title?: string; text?: Record<string, string> }
    | undefined;
  const wordmarkDosAndDonts = messages.brand?.wordmarkDosAndDonts as
    | { subtitle?: string; caption?: Record<string, string> }
    | undefined;
  const partnershipDosAndDonts = messages.brand?.partnershipDosAndDonts as
    | { subtitle?: string; caption?: Record<string, string> }
    | undefined;
  const languageDosAndDonts = messages.brand?.languageDosAndDonts as
    | { subtitle?: string; text?: string }
    | undefined;
  const howToUseWordmark = messages.brand?.howToUseWordmark as
    | {
        title?: string;
        '1'?: {
          subtitle?: string;
          text?: Record<string, string>;
        };
        '2'?: {
          title?: string;
          text?: Record<string, string>;
        };
      }
    | undefined;

  const wordmarkLogoImage = {
    src: '/marketing/brand/brand-0.png',
  };
  const wordmarkDosAndDontsRows = mapSectionTextParagraphs(
    wordmarkDosAndDonts?.caption
  ).map(({ key, body }, index) => ({
    key,
    caption: body,
    src: `/marketing/brand/brand-${index + 1}.png`,
  }));

  const partnershipGoodImage = {
    src: '/marketing/brand/brand-6.png',
  };

  /**
   * Brand image per partnership “Don’t” row, in `caption` key order (`"0"`, `"1"`, `"2"`).
   * Maps each guideline to the correct asset (not sequential brand-7/8/9).
   */
  const partnershipDosAndDontsImageIndices: readonly number[] = [9, 7, 8];

  const partnershipDosAndDontsRows = mapSectionTextParagraphs(
    partnershipDosAndDonts?.caption
  ).map(({ key, body }, index) => ({
    key,
    caption: body,
    src: `/marketing/brand/brand-${
      partnershipDosAndDontsImageIndices[index] ?? index + 7
    }.png`,
  }));

  const languageText =
    languageDosAndDonts?.text != null && languageDosAndDonts.text !== ''
      ? { count: '1' as const, '0': languageDosAndDonts.text }
      : undefined;

  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-[1750px]">
      {/* Page Header */}
      <PageHeader
        subtitle={t('pageHeading.subtitle')}
        title={t('pageHeading.title')}
      />
      {/* Introduction Section */}
      <SectionContent
        title={intro?.title}
        text={intro?.text}
        className="md:my-22.5"
      />
      {/* Logo Section */}
      <SectionContent
        title={logo?.title}
        subtitle={logo?.subtitle}
        text={logo?.text}
        className="my-20 md:my-22.5"
      />
      <div className="flex justify-center mx-6">
        <WordmarkImage
          className="w-full min-w-[250px] md:min-w-[400px] max-w-[600px] transform translate-y-[-15px] md:translate-y-[-75px]"
          src={wordmarkLogoImage.src}
          alt="Todd Wordmark"
          caption={logo?.caption}
          priority
        />
      </div>
      {/* Wordmark Dos and Donts Section */}
      <SectionContent
        subtitle={wordmarkDosAndDonts?.subtitle}
        className="my-10 md:my-20 mt-20 md:mt-36"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-6">
        {wordmarkDosAndDontsRows.map(({ key, src, caption }) => (
          <WordmarkImage
            key={key}
            className="mb-0 md:mb-10 min-w-[320px] md:min-w-[400px] max-w-[600px]"
            src={src}
            alt="Todd Wordmark Dos and Donts"
            caption={caption}
          />
        ))}
      </div>
      {/* How to Use Wordmark Section */}
      {howToUseWordmark?.title ? (
        <HowToUseWordmark
          title={howToUseWordmark.title}
          doHeading={howToUseWordmark['1']?.subtitle ?? 'Do:'}
          doText={howToUseWordmark['1']?.text}
          dontHeading={howToUseWordmark['2']?.title ?? "Don't:"}
          dontText={howToUseWordmark['2']?.text}
        />
      ) : null}
      {/* Brand Partnerships Section */}
      <SectionContent
        title={brandPartnerships?.title}
        text={brandPartnerships?.text}
      />
      <div className="flex justify-center my-10 mx-6">
        <WordmarkImage
          className="w-full min-w-[320px] md:min-w-[400px] max-w-[600px]"
          src={partnershipGoodImage.src}
          alt="Correct Todd wordmark and partner logo pairing"
        />
      </div>
      <SectionContent
        subtitle={partnershipDosAndDonts?.subtitle}
        className="my-10 mt-20 md:mt-28"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-6">
        {partnershipDosAndDontsRows.map(({ key, src, caption }) => (
          <WordmarkImage
            key={key}
            className="mb-10 min-w-[320px] md:min-w-[400px] max-w-[600px]"
            src={src}
            alt="Brand partnership guideline example"
            caption={caption}
          />
        ))}
      </div>
      {/* Language Dos and Donts Section */}
      <SectionContent
        subtitle={languageDosAndDonts?.subtitle}
        subtitleClassName="text-center"
        text={languageText}
        className="my-10 md:my-32"
      />
      {/* Press Releases Section */}
      <SectionContent
        title={pressReleases?.title}
        text={pressReleases?.text}
        className="my-10 md:my-20"
      />
      {/* Usage Terms Section */}
      <SectionContent
        title={usageTerms?.title}
        text={usageTerms?.text}
        className="my-10 md:my-18 md:mb-40 mb-20"
        renderParagraph={renderUsageTermsParagraph}
      />
    </div>
  );
}
