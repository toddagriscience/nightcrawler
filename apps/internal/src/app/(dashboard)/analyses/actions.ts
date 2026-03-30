// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import { analysis, mineral } from '@nightcrawler/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import logger from '@/lib/logger';

/**
 * Fetches all analyses, optionally filtered by search query.
 * @param search - Optional search string for analysis ID or summary
 * @returns Array of analysis records
 */
export async function getAnalyses(search?: string) {
  try {
    if (search) {
      return await db
        .select()
        .from(analysis)
        .where(
          or(
            ilike(analysis.id, `%${search}%`),
            ilike(analysis.summary, `%${search}%`)
          )
        )
        .orderBy(analysis.analysisDate);
    }
    return await db.select().from(analysis).orderBy(analysis.analysisDate);
  } catch (error) {
    logger.error('Failed to fetch analyses:', error);
    return [];
  }
}

/**
 * Gets all minerals for a specific analysis.
 * @param analysisId - The analysis ID to fetch minerals for
 * @returns Array of mineral records
 */
export async function getMineralsForAnalysis(analysisId: string) {
  try {
    return await db
      .select()
      .from(mineral)
      .where(eq(mineral.analysisId, analysisId));
  } catch (error) {
    logger.error('Failed to fetch minerals:', error);
    return [];
  }
}

/**
 * Creates a new analysis with its mineral data.
 * @param data - Analysis fields plus array of mineral entries
 * @returns The created analysis or null on failure
 */
export async function createAnalysis(data: {
  id: string;
  managementZone: number;
  analysisDate: string;
  summary?: string;
  macroActionableInfo?: string;
  minerals: Array<{
    name:
      | 'Calcium'
      | 'Magnesium'
      | 'Sodium'
      | 'Potassium'
      | 'PH'
      | 'Salinity'
      | 'NitrateNitrogen'
      | 'PhosphatePhosphorus'
      | 'Zinc'
      | 'Iron'
      | 'OrganicMatter';
    realValue: number;
    units: 'ppm' | '%';
    actionableInfo?: string;
  }>;
}) {
  try {
    const [newAnalysis] = await db
      .insert(analysis)
      .values({
        id: data.id,
        managementZone: data.managementZone,
        analysisDate: new Date(data.analysisDate),
        summary: data.summary,
        macroActionableInfo: data.macroActionableInfo,
      })
      .returning();

    if (data.minerals.length > 0) {
      await db.insert(mineral).values(
        data.minerals.map((m) => ({
          analysisId: data.id,
          name: m.name,
          realValue: m.realValue,
          units: m.units,
          actionableInfo: m.actionableInfo,
        }))
      );
    }

    return newAnalysis;
  } catch (error) {
    logger.error('Failed to create analysis:', error);
    return null;
  }
}

/**
 * Updates an existing analysis.
 * @param id - The analysis ID to update
 * @param data - Fields to update
 * @returns The updated analysis or null on failure
 */
export async function updateAnalysis(
  id: string,
  data: {
    analysisDate?: string;
    summary?: string;
    macroActionableInfo?: string;
  }
) {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.analysisDate)
      updateData.analysisDate = new Date(data.analysisDate);
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.macroActionableInfo !== undefined)
      updateData.macroActionableInfo = data.macroActionableInfo;

    const [updated] = await db
      .update(analysis)
      .set(updateData)
      .where(eq(analysis.id, id))
      .returning();
    return updated;
  } catch (error) {
    logger.error('Failed to update analysis:', error);
    return null;
  }
}

/**
 * Deletes an analysis by ID.
 * @param id - The analysis ID to delete
 * @returns True if deleted successfully
 */
export async function deleteAnalysis(id: string) {
  try {
    await db.delete(analysis).where(eq(analysis.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete analysis:', error);
    return false;
  }
}
