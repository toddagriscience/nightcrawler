// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Pure display helpers shared by the keyword (command palette) and semantic
 * (results panel) search paths. Intentionally a plain module — no
 * 'use client'/'use server' directive — so it can be imported from both the
 * server action and client components.
 */

import type { SearchResult } from '@/lib/ai/types';

/** Minimal shape needed to build a search result's detail-page href. */
export interface ResultLinkTarget {
  /** Which route family the result belongs to */
  resultType: SearchResult['resultType'];
  /** URL-safe slug used to build the destination route */
  slug: string;
}

/**
 * Resolves the display title for a general IMP, falling back to its first tag
 * and then to the generic label used on the IMP detail page.
 *
 * @param {string | null} title - Stored IMP title, if any
 * @param {string[]} tags - IMP tags; the first tag is the next-best title
 * @returns {string} - The title to display
 */
export function impDisplayTitle(title: string | null, tags: string[]): string {
  return title ?? tags[0] ?? 'Integrated Management Practice';
}

/**
 * Builds the detail-page href for a search result by its result type.
 *
 * @param {ResultLinkTarget} result - Result type and slug to link to
 * @returns {string} - The route to the result's detail page
 */
export function resultHref(result: ResultLinkTarget): string {
  switch (result.resultType) {
    case 'seed':
      return `/product/${result.slug}`;
    case 'general-imp':
      return `/imp/general/${result.slug}`;
    default:
      return `/imp/${result.slug}`;
  }
}

/**
 * Trims preview text to a maximum length, appending an ellipsis when the
 * content was truncated.
 *
 * @param {string | null | undefined} content - Full text to preview
 * @param {number} maxLen - Maximum number of characters before truncation
 * @returns {string} - The trimmed preview text
 */
export function previewText(
  content: string | null | undefined,
  maxLen: number
): string {
  if (!content) return '';
  if (content.length <= maxLen) return content;
  return `${content.slice(0, maxLen)}…`;
}
