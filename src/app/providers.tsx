// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
    cookieless_mode: 'on_reject',
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
