// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getLocalizedPath } from '@/lib/canonical-urls';
import { ARTICLE_INDEX_TOPIC_TYPES } from '@/lib/sanity/article-types';

/** Public paths whose route exists; missing resources on dynamic paths are checked separately. */
export function isKnownPublicRoute(pathname: string): boolean {
  const path = getLocalizedPath(pathname);
  const staticPaths = [
    '/',
    '/about',
    '/research',
    '/research/index',
    '/news',
    '/careers',
    '/careers/search',
    '/brand',
    '/contact',
    '/login',
    '/forgot-password',
    '/investors',
    '/investors/esg',
    '/accessibility',
    '/privacy',
    '/terms',
    '/legal',
    '/signup',
    '/accept',
    '/externship-terms',
    '/auth/accept-invite',
    '/auth/confirm',
    '/auth/error/auth-code',
    '/invite',
    '/creators',
    '/ten-rising-stars',
    '/partner',
  ];
  return (
    staticPaths.includes(path) ||
    /^\/(index|news|careers|about|forms)\/[^/]+$/.test(path) ||
    ARTICLE_INDEX_TOPIC_TYPES.some(
      (topic) => path === `/research/index/${topic}`
    )
  );
}
