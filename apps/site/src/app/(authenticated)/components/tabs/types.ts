// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TabSelect } from '@/lib/types/db';

export type NamedTab = TabSelect & { name: string | null };
