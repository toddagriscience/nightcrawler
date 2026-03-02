// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getUserEmail } from '../auth';
import { farm, user } from '../db/schema';
import { db } from '../db/schema/connection';
import { eq } from 'drizzle-orm';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';
import { logger } from '@/lib/logger';

/**
 * Gets the authenticated user's information. Throws an error if the user
 * is not authenticated, not found, or not associated with a farm.
 *
 * At the moment, this simply returns all of the user's information for sake of type simplicity. This should be optimized in the future.
 *
 * @returns The authenticated user's information with non-null farmId
 * @throws {Error} - If user is not authenticated, not found, or not associated with a farm
 */
export async function getAuthenticatedInfo(): Promise<AuthenticatedInfo> {
  const email = await getUserEmail();

  if (!email) {
    throw new Error("No email registered with this user's account");
  }

  const [row] = await db
    .select({ user, farmApproved: farm.approved })
    .from(user)
    .leftJoin(farm, eq(farm.id, user.farmId))
    .where(eq(user.email, email))
    .limit(1)
    .catch((error) => {
      logger.error('Error querying for current user', { error, email });
      throw error;
    });

  if (!row) {
    throw new Error('User not found');
  }

  const currentUser = row.user;

  if (!currentUser.farmId) {
    throw new Error('User is not associated with a farm');
  }

  return {
    ...currentUser,
    farmId: currentUser.farmId,
    approved: row.farmApproved ?? false,
  };
}
