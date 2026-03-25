// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import { seedProduct } from '@nightcrawler/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import logger from '@/lib/logger';

/**
 * Fetches all seed products, optionally filtered by search query.
 * @param search - Optional search string for product name or slug
 * @returns Array of seed product records
 */
export async function getSeedProducts(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(seedProduct)
        .where(
          or(
            ilike(seedProduct.name, `%${search}%`),
            ilike(seedProduct.slug, `%${search}%`)
          )
        )
        .orderBy(seedProduct.id);
    }
    return await db.select().from(seedProduct).orderBy(seedProduct.id);
  } catch (error) {
    logger.error('Failed to fetch seed products:', error);
    return [];
  }
}

/**
 * Gets a single seed product by slug.
 * @param slug - The product slug
 * @returns The seed product or null
 */
export async function getSeedProductBySlug(slug: string) {
  try {
    const [result] = await db
      .select()
      .from(seedProduct)
      .where(eq(seedProduct.slug, slug));
    return result ?? null;
  } catch (error) {
    logger.error('Failed to fetch seed product:', error);
    return null;
  }
}

/**
 * Creates a new seed product.
 * @param data - Seed product fields
 * @returns The created product or null
 */
export async function createSeedProduct(data: {
  knowledgeArticleId: number;
  name: string;
  slug: string;
  description: string;
  stock: number;
  priceInCents: number;
  unit?: string;
  imageUrl?: string;
  advisorContactUrl?: string;
  relatedIntegratedManagementPlanId?: number;
}) {
  try {
    const [result] = await db.insert(seedProduct).values(data).returning();
    return result;
  } catch (error) {
    logger.error('Failed to create seed product:', error);
    return null;
  }
}

/**
 * Updates an existing seed product.
 * @param id - Product ID
 * @param data - Fields to update
 * @returns The updated product or null
 */
export async function updateSeedProduct(
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    stock?: number;
    priceInCents?: number;
    unit?: string;
    imageUrl?: string;
    advisorContactUrl?: string;
    relatedIntegratedManagementPlanId?: number;
  }
) {
  try {
    const [result] = await db
      .update(seedProduct)
      .set(data)
      .where(eq(seedProduct.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update seed product:', error);
    return null;
  }
}

/**
 * Deletes a seed product by ID.
 * @param id - Product ID
 * @returns True if deleted successfully
 */
export async function deleteSeedProduct(id: number) {
  try {
    await db.delete(seedProduct).where(eq(seedProduct.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete seed product:', error);
    return false;
  }
}
