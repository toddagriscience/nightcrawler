// Copyright © Todd Agriscience, Inc. All rights reserved.

import logger from '@/lib/logger';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';

export const farmEditRoles = ['Admin'] as const;

export function canEditFarm(
  currentUser: Pick<AuthenticatedInfo, 'id' | 'farmId' | 'role'>
): boolean {
  return currentUser.role === 'Admin';
}

export function assertCanEditFarm(
  currentUser: Pick<AuthenticatedInfo, 'id' | 'farmId' | 'role'>,
  action: string
): void {
  if (canEditFarm(currentUser)) {
    return;
  }

  logger.warn('Denied farm edit attempt', {
    action,
    userId: currentUser.id,
    farmId: currentUser.farmId,
    role: currentUser.role,
  });

  throw new Error('You do not have permission to edit farm information');
}
