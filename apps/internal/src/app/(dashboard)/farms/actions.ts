// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import {
  farm,
  managementZone,
  standardValues,
  farmSubscription,
} from '@nightcrawler/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import logger from '@/lib/logger';

// ──────────────────────────── FARMS ────────────────────────────

/**
 * Fetches all farms, optionally filtering by search query.
 * @param search - Optional search string for farm name
 * @returns Array of farm records
 */
export async function getFarms(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(farm)
        .where(
          or(
            ilike(farm.informalName, `%${search}%`),
            ilike(farm.businessName, `%${search}%`)
          )
        )
        .orderBy(farm.id);
    }
    return await db.select().from(farm).orderBy(farm.id);
  } catch (error) {
    logger.error('Failed to fetch farms:', error);
    return [];
  }
}

/**
 * Creates a new farm.
 * @param data - Farm fields
 * @returns The created farm or null
 */
export async function createFarm(data: {
  informalName?: string;
  businessName?: string;
  businessWebsite?: string;
  managementStartDate?: string;
  approved?: boolean;
  stripeCustomerId?: string;
}) {
  try {
    const [result] = await db
      .insert(farm)
      .values({
        informalName: data.informalName,
        businessName: data.businessName,
        businessWebsite: data.businessWebsite,
        managementStartDate: data.managementStartDate,
        approved: data.approved,
        stripeCustomerId: data.stripeCustomerId,
      })
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to create farm:', error);
    return null;
  }
}

/**
 * Updates an existing farm.
 * @param id - Farm ID
 * @param data - Fields to update
 * @returns The updated farm or null
 */
export async function updateFarm(
  id: number,
  data: {
    informalName?: string;
    businessName?: string;
    businessWebsite?: string;
    managementStartDate?: string;
    approved?: boolean;
    stripeCustomerId?: string;
  }
) {
  try {
    const [result] = await db
      .update(farm)
      .set(data)
      .where(eq(farm.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update farm:', error);
    return null;
  }
}

/**
 * Deletes a farm by ID.
 * @param id - Farm ID
 * @returns True if deleted successfully
 */
export async function deleteFarm(id: number) {
  try {
    await db.delete(farm).where(eq(farm.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete farm:', error);
    return false;
  }
}

// ──────────────────────────── MANAGEMENT ZONES ────────────────────────────

/**
 * Fetches management zones, optionally filtered by search.
 * @param search - Optional search string for zone name
 * @returns Array of management zone records
 */
export async function getManagementZones(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(managementZone)
        .where(ilike(managementZone.name, `%${search}%`))
        .orderBy(managementZone.id);
    }
    return await db.select().from(managementZone).orderBy(managementZone.id);
  } catch (error) {
    logger.error('Failed to fetch management zones:', error);
    return [];
  }
}

/**
 * Creates a new management zone.
 * @param data - Management zone fields
 * @returns The created zone or null
 */
export async function createManagementZone(data: {
  farmId?: number;
  name?: string;
  npk?: boolean;
  npkLastUsed?: string;
  irrigation?: boolean;
  waterConservation?: boolean;
}) {
  try {
    const [result] = await db
      .insert(managementZone)
      .values({
        farmId: data.farmId,
        name: data.name,
        npk: data.npk,
        npkLastUsed: data.npkLastUsed ? new Date(data.npkLastUsed) : undefined,
        irrigation: data.irrigation,
        waterConservation: data.waterConservation,
      })
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to create management zone:', error);
    return null;
  }
}

/**
 * Updates a management zone.
 * @param id - Zone ID
 * @param data - Fields to update
 * @returns The updated zone or null
 */
export async function updateManagementZone(
  id: number,
  data: {
    farmId?: number;
    name?: string;
    npk?: boolean;
    npkLastUsed?: string;
    irrigation?: boolean;
    waterConservation?: boolean;
  }
) {
  try {
    const updateData: Record<string, unknown> = { ...data };
    if (data.npkLastUsed) updateData.npkLastUsed = new Date(data.npkLastUsed);
    const [result] = await db
      .update(managementZone)
      .set(updateData)
      .where(eq(managementZone.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update management zone:', error);
    return null;
  }
}

/**
 * Deletes a management zone.
 * @param id - Zone ID
 * @returns True if deleted successfully
 */
export async function deleteManagementZone(id: number) {
  try {
    await db.delete(managementZone).where(eq(managementZone.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete management zone:', error);
    return false;
  }
}

// ──────────────────────────── STANDARD VALUES ────────────────────────────

/**
 * Fetches all standard values.
 * @returns Array of standard value records
 */
export async function getStandardValues() {
  try {
    return await db.select().from(standardValues).orderBy(standardValues.id);
  } catch (error) {
    logger.error('Failed to fetch standard values:', error);
    return [];
  }
}

/**
 * Updates standard values for a farm.
 * @param id - Standard values record ID
 * @param data - Fields to update
 * @returns The updated record or null
 */
export async function updateStandardValues(
  id: number,
  data: Record<string, number>
) {
  try {
    const [result] = await db
      .update(standardValues)
      .set(data)
      .where(eq(standardValues.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update standard values:', error);
    return null;
  }
}

// ──────────────────────────── SUBSCRIPTIONS (READ-ONLY) ────────────────────────────

/**
 * Fetches all farm subscriptions (read-only view).
 * @returns Array of subscription records
 */
export async function getFarmSubscriptions() {
  try {
    return await db
      .select()
      .from(farmSubscription)
      .orderBy(farmSubscription.farmId);
  } catch (error) {
    logger.error('Failed to fetch subscriptions:', error);
    return [];
  }
}
