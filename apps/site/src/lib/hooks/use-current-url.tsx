// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
import logger from '../logger';

export default function useCurrentUrl() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const windowHelper = async () => {
      setUrl(window.location.href);
    };
    windowHelper().catch((e) => {
      logger.log(e);
    });
  }, []);

  return url;
}
