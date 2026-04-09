// Copyright © Todd Agriscience, Inc. All rights reserved.

import PageHeader from '@/components/common/page-header/page-header';
import SectionContent, {
  mapSectionTextParagraphs,
} from '@/components/section-content/section-content';
import { Link } from '@/i18n/config';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import HowToUseWordmark from './components/how-to-use-wordmark/how-to-use-wordmark';
import WordmarkImage from './components/wordmarkimage/wordmarkimage';

const TERMS_OF_USE = 'Terms of Use';

function renderUsageTermsParagraph(body: string, index: number): ReactNode {
  if (index !== 0) {
    return body;
  }
  const idx = body.indexOf(TERMS_OF_USE);
  if (idx === -1) {
    return body;
  }
  return (
    <>
      {body.slice(0, idx)}
      <Link href="/terms" className="underline underline-offset-2">
        {TERMS_OF_USE}
      </Link>
      {body.slice(idx + TERMS_OF_USE.length)}
    </>
  );
}

/**
 * Brand page: intro and logo sections use `text.count` + indexed strings from locale JSON (what-we-do style).
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
    height: 395,
    width: 600,
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
    width: 532,
    height: 350,
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

  const usageTermsParagraphs = mapSectionTextParagraphs(usageTerms?.text);

  const languageText =
    languageDosAndDonts?.text != null && languageDosAndDonts.text !== ''
      ? { count: '1' as const, '0': languageDosAndDonts.text }
      : undefined;

  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-[1700px]">
      {/* Page Header */}
      <PageHeader
        subtitle={t('pageHeading.subtitle')}
        title={t('pageHeading.title')}
      />
      {/* Introduction Section */}
      <SectionContent
        title={intro?.title}
        text={intro?.text}
        className="my-22.5"
      />
      {/* Logo Section */}
      <SectionContent
        title={logo?.title}
        subtitle={logo?.subtitle}
        text={logo?.text}
        className="my-22.5"
      />
      <WordmarkImage
        className="transform translate-y-[-75px]"
        src={wordmarkLogoImage.src}
        alt="Todd Wordmark"
        width={wordmarkLogoImage.width}
        height={wordmarkLogoImage.height}
        caption={logo?.caption}
      />
      <SectionContent
        subtitle={wordmarkDosAndDonts?.subtitle}
        className="my-22.5"
      />
      <div className="flex flex-wrap items-center justify-start gap-5 my-8 md:my-10 mx-6">
        {wordmarkDosAndDontsRows.map(({ key, src, caption }) => (
          <WordmarkImage
            key={key}
            className="mb-10"
            src={src}
            alt="Todd Wordmark Dos and Donts"
            width={532}
            height={350}
            caption={caption}
          />
        ))}
      </div>
      {howToUseWordmark?.title ? (
        <HowToUseWordmark
          title={howToUseWordmark.title}
          doHeading={howToUseWordmark['1']?.subtitle ?? 'Do:'}
          doText={howToUseWordmark['1']?.text}
          dontHeading={howToUseWordmark['2']?.title ?? "Don't:"}
          dontText={howToUseWordmark['2']?.text}
        />
      ) : null}
      <SectionContent
        title={brandPartnerships?.title}
        text={brandPartnerships?.text}
        className="my-22.5"
      />
      <div className="w-full max-w-[800px] flex justify-center my-8">
        <WordmarkImage
          src={partnershipGoodImage.src}
          alt="Correct Todd wordmark and partner logo pairing"
          width={partnershipGoodImage.width}
          height={partnershipGoodImage.height}
        />
      </div>
      <SectionContent
        subtitle={partnershipDosAndDonts?.subtitle}
        className="my-22.5"
      />
      <div className="flex flex-wrap items-center justify-start gap-5 my-8 md:my-10 mx-6">
        {partnershipDosAndDontsRows.map(({ key, src, caption }) => (
          <WordmarkImage
            key={key}
            className="mb-10"
            src={src}
            alt="Brand partnership guideline example"
            width={532}
            height={350}
            caption={caption}
          />
        ))}
      </div>
      <SectionContent
        subtitle={languageDosAndDonts?.subtitle}
        text={languageText}
        className="my-22.5"
      />
      <SectionContent
        title={pressReleases?.title}
        text={pressReleases?.text}
        className="my-22.5"
      />
      {usageTerms?.title && usageTermsParagraphs.length > 0 ? (
        <div className="flex flex-col gap-4 text-left max-w-[800px] my-22.5">
          <h2 className="text-3xl md:text-3xl lg:text-5xl/[80px] text-foreground">
            {usageTerms.title}
          </h2>
          <div className="text-sm lg:text-[17px]/[28px] font-thin space-y-4.75">
            {usageTermsParagraphs.map(({ key, body }, index) => (
              <p key={key}>{renderUsageTermsParagraph(body, index)}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
