// Copyright © Todd Agriscience, Inc. All rights reserved.

import { UserSelect } from '@/lib/types/db';

export type AuthenticatedInfo = UserSelect & {
  farmId: number;
  approved: boolean;
};
