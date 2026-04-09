// Copyright © Todd Agriscience, Inc. All rights reserved.

import PageHeader from '@/components/common/page-header/page-header';
import SectionContent, {
  mapSectionTextParagraphs,
} from '@/components/section-content/section-content';
import { getMessages, getTranslations } from 'next-intl/server';
import HowToUseWordmark from './components/how-to-use-wordmark/how-to-use-wordmark';
import WordmarkImage from './components/wordmarkimage/wordmarkimage';

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
  const wordmarkDosAndDonts = messages.brand?.wordmarkDosAndDonts as
    | { subtitle?: string; caption?: Record<string, string> }
    | undefined;
  const partnershipDosAndDonts = messages.brand?.partnershipDosAndDonts as
    | { subtitle?: string; text?: Record<string, string> }
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
    </div>
  );
}
