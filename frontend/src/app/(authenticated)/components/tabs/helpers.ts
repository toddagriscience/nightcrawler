// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NamedTab } from './types';

// Oversimplification perhaps, but it works.
export function getTabHash(tab: NamedTab) {
  return String(tab.id);
}
