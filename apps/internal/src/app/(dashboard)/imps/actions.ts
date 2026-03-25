// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import { integratedManagementPlan } from '@nightcrawler/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import logger from '@/lib/logger';

/**
 * Fetches all IMPs, optionally filtered by search query.
 * @param search - Optional search string for title or slug
 * @returns Array of IMP records
 */
export async function getImps(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(integratedManagementPlan)
        .where(
          or(
            ilike(integratedManagementPlan.title, `%${search}%`),
            ilike(integratedManagementPlan.slug, `%${search}%`)
          )
        )
        .orderBy(integratedManagementPlan.id);
    }
    return await db
      .select()
      .from(integratedManagementPlan)
      .orderBy(integratedManagementPlan.id);
  } catch (error) {
    logger.error('Failed to fetch IMPs:', error);
    return [];
  }
}

/**
 * Creates a new IMP.
 * @param data - IMP fields
 * @returns The created IMP or null
 */
export async function createImp(data: {
  knowledgeArticleId: number;
  title: string;
  slug: string;
  content: string;
  category:
    | 'soil'
    | 'planting'
    | 'water'
    | 'insects_disease'
    | 'harvest_storage'
    | 'go_to_market'
    | 'seed_products';
  source?: string;
  managementZone?: number;
  analysis?: string;
  plan?: string;
  initialized: string;
  updated?: string;
}) {
  try {
    const [result] = await db
      .insert(integratedManagementPlan)
      .values({
        knowledgeArticleId: data.knowledgeArticleId,
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        source: data.source,
        managementZone: data.managementZone,
        analysis: data.analysis,
        plan: data.plan,
        initialized: new Date(data.initialized),
        updated: data.updated ? new Date(data.updated) : undefined,
      })
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to create IMP:', error);
    return null;
  }
}

/**
 * Updates an existing IMP.
 * @param id - IMP ID
 * @param data - Fields to update
 * @returns The updated IMP or null
 */
export async function updateImp(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    category?:
      | 'soil'
      | 'planting'
      | 'water'
      | 'insects_disease'
      | 'harvest_storage'
      | 'go_to_market'
      | 'seed_products';
    source?: string;
    managementZone?: number;
    analysis?: string;
    plan?: string;
    updated?: string;
  }
) {
  try {
    const updateData: Record<string, unknown> = { ...data };
    if (data.updated) updateData.updated = new Date(data.updated);
    const [result] = await db
      .update(integratedManagementPlan)
      .set(updateData)
      .where(eq(integratedManagementPlan.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update IMP:', error);
    return null;
  }
}

/**
 * Deletes an IMP by ID.
 * @param id - IMP ID
 * @returns True if deleted successfully
 */
export async function deleteImp(id: number) {
  try {
    await db
      .delete(integratedManagementPlan)
      .where(eq(integratedManagementPlan.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete IMP:', error);
    return false;
  }
}
