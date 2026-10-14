// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { JobPosting, WithContext } from 'schema-dts';
import { getCanonicalUrl } from '@/lib/canonical-urls';
import type { SanityArticle } from './article-types';

/** Employment types supported by Google's JobPosting format. */
export const JOB_EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACTOR',
  'TEMPORARY',
  'INTERN',
  'VOLUNTEER',
  'PER_DIEM',
  'OTHER',
] as const;

/** Physical workplace address approved by the recruiting owner. */
export interface JobAddress {
  streetAddress?: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

/** Verified compensation displayed on the job page. */
export interface JobSalary {
  currency: string;
  minValue: number;
  maxValue: number;
  unitText: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
}

function validDate(value: string | undefined): boolean {
  return (
    !!value &&
    /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

/** Closing and expiry are evaluated against the request clock, even when CMS records are cached. */
export function isActiveJob(
  article: Pick<
    SanityArticle,
    '_type' | 'jobStatus' | 'datePosted' | 'validThrough'
  >,
  now = Date.now()
): boolean {
  if (article._type !== 'career') return true;
  if (article.jobStatus === 'closed') return false;
  if (
    article.datePosted &&
    (!validDate(article.datePosted) || Date.parse(article.datePosted) > now)
  )
    return false;
  return (
    !article.validThrough ||
    (validDate(article.validThrough) && Date.parse(article.validThrough) > now)
  );
}

/** General-interest applications are not advertisements for a specific vacancy. */
export function isGeneralApplication(article: SanityArticle): boolean {
  return (
    article.jobPostingKind === 'general-application' ||
    article.slug.current === 'general-application'
  );
}

function countryName(code: string): string | undefined {
  // ICU also names sentinel, aggregate and pseudo regions; none is a country.
  if (
    !/^[A-Z]{2}$/.test(code) ||
    ['ZZ', 'EU', 'UN', 'XA', 'XB', 'QO'].includes(code)
  )
    return undefined;
  const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
  return name && name !== code ? name : undefined;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Full visible Portable Text job description serialized as safe, formatted HTML. */
export function getJobDescriptionHtml(article: SanityArticle): string {
  const blocks = (article.content ?? []).filter(
    (block) => block._type === 'block'
  );
  const summary = article.summary?.trim();
  return (
    (summary ? `<p>${escapeHtml(summary)}</p>` : '') +
    blocks
      .map((block) => {
        const text = escapeHtml(
          block.children.map((child) => child.text ?? '').join('')
        );
        if (!text.trim()) return '';
        if (block.listItem) return `<ul><li>${text}</li></ul>`;
        const tag = /^h[1-6]$/.test(block.style ?? '')
          ? block.style === 'h1'
            ? 'h2'
            : block.style
          : 'p';
        return `<${tag}>${text}</${tag}>`;
      })
      .join('')
  );
}

/** Exact editorial prerequisites; unverified legacy rows never receive fabricated job schema. */
export function getJobPostingMissingFields(article: SanityArticle): string[] {
  if (isGeneralApplication(article)) return [];
  const missing: string[] = [];
  if (!validDate(article.datePosted)) missing.push('datePosted');
  if (!validDate(article.validThrough) && article.noExpiry !== true)
    missing.push('validThrough or confirmed noExpiry');
  if (
    !article.employmentTypes?.length ||
    article.employmentTypes.some((type) => !JOB_EMPLOYMENT_TYPES.includes(type))
  )
    missing.push('employmentTypes');
  if (!['remote', 'onsite', 'hybrid'].includes(article.workplaceType ?? ''))
    missing.push('workplaceType');
  if (article.workplaceType === 'remote') {
    if (
      !article.applicantCountries?.length ||
      article.applicantCountries.some((code) => !countryName(code))
    )
      missing.push('applicantCountries');
  } else if (article.workplaceType) {
    if (
      !article.jobAddress?.addressLocality?.trim() ||
      !countryName(article.jobAddress.addressCountry ?? '')
    )
      missing.push('jobAddress');
  }
  if (!getJobDescriptionHtml(article)) missing.push('content');
  if (!article.applyUrl?.trim()) missing.push('applyUrl');
  const salary = article.baseSalary;
  const salaryValid =
    salary &&
    /^[A-Z]{3}$/.test(salary.currency) &&
    Number.isFinite(salary.minValue) &&
    Number.isFinite(salary.maxValue) &&
    salary.minValue >= 0 &&
    salary.maxValue >= salary.minValue &&
    ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'].includes(salary.unitText);
  if (
    (salary || /[$€£]\s*\d/.test(getJobDescriptionHtml(article))) &&
    !salaryValid
  )
    missing.push('baseSalary currency, range and pay period');
  return missing;
}

/** Eligible active job schema uses only verified fields also displayed to applicants. */
export function createJobPostingStructuredData(
  article: SanityArticle,
  now = Date.now()
): WithContext<JobPosting> | null {
  if (
    article._type !== 'career' ||
    !isActiveJob(article, now) ||
    isGeneralApplication(article) ||
    getJobPostingMissingFields(article).length
  )
    return null;
  const canonical = getCanonicalUrl(
    `/careers/${article.slug.current}`,
    article.language ?? 'en'
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: article.title,
    description: getJobDescriptionHtml(article),
    datePosted: article.datePosted,
    validThrough: article.validThrough,
    employmentType: article.employmentTypes,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Todd Agriscience',
      sameAs: 'https://toddagriscience.com',
      logo: 'https://toddagriscience.com/icon.png',
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'Todd Agriscience',
      value: article._id,
    },
    ...(article.workplaceType === 'remote'
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: article.applicantCountries?.map(
            (code) => ({ '@type': 'Country' as const, name: countryName(code) })
          ),
        }
      : {
          jobLocation: {
            '@type': 'Place' as const,
            address: {
              '@type': 'PostalAddress' as const,
              ...article.jobAddress,
            },
          },
        }),
    ...(article.baseSalary
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount' as const,
            currency: article.baseSalary.currency,
            value: {
              '@type': 'QuantitativeValue' as const,
              minValue: article.baseSalary.minValue,
              maxValue: article.baseSalary.maxValue,
              unitText: article.baseSalary.unitText,
            },
          },
        }
      : {}),
    url: canonical,
  };
}
