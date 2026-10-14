// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
import logger from '../logger';
import { getCanonicalUrl } from '@/lib/canonical-urls';

export default function useCurrentUrl() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const windowHelper = async () => {
      const canonical = document.querySelector<HTMLLinkElement>(
        'link[rel=canonical]'
      )?.href;
      const locale = /^\/es(?:\/|$)/.test(window.location.pathname)
        ? 'es'
        : 'en';
      setUrl(canonical ?? getCanonicalUrl(window.location.pathname, locale));
    };
    windowHelper().catch((e) => {
      logger.log(e);
    });
  }, []);

  return url;
}
