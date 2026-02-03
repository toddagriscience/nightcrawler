// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Tab } from './types';

// Oversimplification perhaps, but it works.
export function getTabHash(tab: Tab) {
  return String(tab.id);
}
