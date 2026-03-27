// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import { user } from '@nightcrawler/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import logger from '@/lib/logger';

/**
 * Fetches all users, optionally filtered by search query.
 * @param search - Optional search string for name or email
 * @returns Array of user records
 */
export async function getUsers(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(user)
        .where(
          or(
            ilike(user.firstName, `%${search}%`),
            ilike(user.lastName, `%${search}%`),
            ilike(user.email, `%${search}%`)
          )
        )
        .orderBy(user.id);
    }
    return await db.select().from(user).orderBy(user.id);
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    return [];
  }
}

/**
 * Creates a new user.
 * @param data - User fields
 * @returns The created user or null
 */
export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  job?: string;
  role: 'Admin' | 'Viewer';
  farmId?: number;
  didOwnAndControlParcel?: boolean;
  didManageAndControl?: boolean;
}) {
  try {
    const [result] = await db
      .insert(user)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        job: data.job || undefined,
        role: data.role,
        farmId: data.farmId || undefined,
        didOwnAndControlParcel: data.didOwnAndControlParcel,
        didManageAndControl: data.didManageAndControl,
      })
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to create user:', error);
    return null;
  }
}

/**
 * Updates an existing user.
 * @param id - User ID
 * @param data - Fields to update
 * @returns The updated user or null
 */
export async function updateUser(
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    job?: string;
    role?: 'Admin' | 'Viewer';
    farmId?: number;
    didOwnAndControlParcel?: boolean;
    didManageAndControl?: boolean;
  }
) {
  try {
    const [result] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update user:', error);
    return null;
  }
}

/**
 * Deletes a user by ID.
 * @param id - User ID
 * @returns True if deleted successfully
 */
export async function deleteUser(id: number) {
  try {
    await db.delete(user).where(eq(user.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete user:', error);
    return false;
  }
}
