// Copyright © Todd Agriscience, Inc. All rights reserved.

import React from 'react';
import { __setNavigation } from '../mocks/next-navigation';

/** The `parameters.nextjs` block stories use to describe their route. */
interface NextParameters {
  nextjs?: {
    navigation?: {
      pathname?: string;
      query?: Record<string, string>;
      segments?: Record<string, string | string[]>;
    };
  };
}

/**
 * Feeds each story's `parameters.nextjs.navigation` to the `next/navigation`
 * mock before the story renders, so components calling `usePathname()` see the
 * route the story declared rather than an empty default.
 *
 * @param Story - The story being rendered
 * @param context - Storybook context carrying the story's parameters
 * @returns The story, with navigation state applied
 */
export const withNextNavigation = (
  Story: React.ComponentType,
  context: { parameters: NextParameters }
) => {
  // Applied during render rather than in an effect: the hooks are read on the
  // first pass, so an effect would land a frame too late.
  __setNavigation(context.parameters?.nextjs?.navigation ?? {});
  return <Story />;
};
