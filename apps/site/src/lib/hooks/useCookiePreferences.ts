// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState, useCallback } from 'react';
import posthog from 'posthog-js';

/**
 * Hook to manage cookie preferences using localStorage and PostHog
 * @returns {object} Cookie preferences state and methods
 */
export function useCookiePreferences() {
  const [isCapturing, setIsCapturing] = useState<boolean>(
    posthog.get_explicit_consent_status() == 'denied' ||
      posthog.get_explicit_consent_status() == 'pending'
      ? false
      : true
  );

  function applyPostHogPreference(enabled: boolean) {
    if (enabled) {
      posthog.opt_in_capturing();
      setIsCapturing(true);
    } else {
      posthog.opt_out_capturing();
      setIsCapturing(false);
    }
  }

  return {
    isCapturing,
    applyPostHogPreference,
  };
}
