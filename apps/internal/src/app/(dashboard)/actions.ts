// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import { internalAccount } from '@nightcrawler/db/schema';
import { eq, ilike, or, sql } from 'drizzle-orm';
import logger from '@/lib/logger';

/**
 * Fetches all internal accounts, optionally filtering by search query.
 * @param search - Optional search query to filter by name or email
 * @returns Array of internal account records
 */
export async function getInternalAccounts(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(internalAccount)
        .where(
          or(
            ilike(internalAccount.firstName, `%${search}%`),
            ilike(internalAccount.lastName, `%${search}%`),
            ilike(internalAccount.email, `%${search}%`)
          )
        )
        .orderBy(internalAccount.id);
    }
    return await db.select().from(internalAccount).orderBy(internalAccount.id);
  } catch (error) {
    logger.error('Failed to fetch internal accounts:', error);
    return [];
  }
}

/**
 * Creates a new internal account.
 * @param data - Account fields to create
 * @returns The created account or null on failure
 */
export async function createInternalAccount(data: {
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  isActive?: boolean;
}) {
  try {
    const [account] = await db.insert(internalAccount).values(data).returning();
    return account;
  } catch (error) {
    logger.error('Failed to create internal account:', error);
    return null;
  }
}

/**
 * Updates an existing internal account.
 * @param id - The account ID to update
 * @param data - Fields to update
 * @returns The updated account or null on failure
 */
export async function updateInternalAccount(
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    title?: string;
    isActive?: boolean;
  }
) {
  try {
    const [account] = await db
      .update(internalAccount)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(internalAccount.id, id))
      .returning();
    return account;
  } catch (error) {
    logger.error('Failed to update internal account:', error);
    return null;
  }
}

/**
 * Deletes an internal account.
 * @param id - The account ID to delete
 * @returns True if deleted successfully
 */
export async function deleteInternalAccount(id: number) {
  try {
    await db.delete(internalAccount).where(eq(internalAccount.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete internal account:', error);
    return false;
  }
}
