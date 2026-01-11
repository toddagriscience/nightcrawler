// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState, useCallback } from 'react';
import posthog from 'posthog-js';

const COOKIE_PREFERENCES_KEY = 'user_cookie_consent';
const COOKIE_ENABLED_KEY = 'cookies_enabled';

export interface CookiePreferences {
  enabled: boolean;
  timestamp?: number;
}

/**
 * Hook to manage cookie preferences using localStorage and PostHog
 * @returns {object} Cookie preferences state and methods
 */
export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Apply cookie preference to PostHog
   */
  const applyPostHogPreference = useCallback((enabled: boolean) => {
    if (typeof window === 'undefined') return;

    try {
      // PostHog methods are safe to call even if not fully initialized
      if (enabled) {
        posthog.opt_in_capturing();
      } else {
        posthog.opt_out_capturing();
      }
      // Also store a simple flag for easy checking
      localStorage.setItem(COOKIE_ENABLED_KEY, String(enabled));
    } catch (error) {
      console.error('Error applying PostHog preference:', error);
    }
  }, []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored);
        setPreferences(parsed);
        // Apply stored preference to PostHog
        applyPostHogPreference(parsed.enabled);
      } else {
        // Default: cookies enabled (since user accepts when creating account)
        // This will be set when account is created, but for now default to enabled
        const defaultPrefs: CookiePreferences = {
          enabled: true,
          timestamp: Date.now(),
        };
        setPreferences(defaultPrefs);
        applyPostHogPreference(true);
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
      // Default to enabled on error
      const defaultPrefs: CookiePreferences = {
        enabled: true,
        timestamp: Date.now(),
      };
      setPreferences(defaultPrefs);
      applyPostHogPreference(true);
    } finally {
      setIsLoading(false);
    }
  }, [applyPostHogPreference]);

  /**
   * Update cookie preferences
   */
  const updatePreferences = useCallback(
    (enabled: boolean) => {
      if (typeof window === 'undefined') return;

      const newPreferences: CookiePreferences = {
        enabled,
        timestamp: Date.now(),
      };

      try {
        localStorage.setItem(
          COOKIE_PREFERENCES_KEY,
          JSON.stringify(newPreferences)
        );
        setPreferences(newPreferences);
        applyPostHogPreference(enabled);
      } catch (error) {
        console.error('Error saving cookie preferences:', error);
      }
    },
    [applyPostHogPreference]
  );

  /**
   * Check if cookies are currently enabled
   */
  const areCookiesEnabled = preferences?.enabled ?? true;

  return {
    preferences,
    areCookiesEnabled,
    isLoading,
    updatePreferences,
  };
}
