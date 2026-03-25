// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import { tab, widget } from '@nightcrawler/db/schema';
import { eq } from 'drizzle-orm';
import logger from '@/lib/logger';

// ──────────────────────────── TABS ────────────────────────────

/**
 * Fetches all tabs.
 * @returns Array of tab records
 */
export async function getTabs() {
  try {
    return await db.select().from(tab).orderBy(tab.id);
  } catch (error) {
    logger.error('Failed to fetch tabs:', error);
    return [];
  }
}

/**
 * Creates a new tab.
 * @param data - Tab fields
 * @returns The created tab or null
 */
export async function createTab(data: {
  user: number;
  managementZone: number;
}) {
  try {
    const [result] = await db.insert(tab).values(data).returning();
    return result;
  } catch (error) {
    logger.error('Failed to create tab:', error);
    return null;
  }
}

/**
 * Deletes a tab by ID.
 * @param id - Tab ID
 * @returns True if deleted successfully
 */
export async function deleteTab(id: number) {
  try {
    await db.delete(tab).where(eq(tab.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete tab:', error);
    return false;
  }
}

// ──────────────────────────── WIDGETS ────────────────────────────

/**
 * Fetches all widgets.
 * @returns Array of widget records
 */
export async function getWidgets() {
  try {
    return await db.select().from(widget).orderBy(widget.id);
  } catch (error) {
    logger.error('Failed to fetch widgets:', error);
    return [];
  }
}

/**
 * Creates a new widget.
 * @param data - Widget fields
 * @returns The created widget or null
 */
export async function createWidget(data: {
  managementZone: number;
  name:
    | 'Macro Radar'
    | 'Calcium Widget'
    | 'PH Widget'
    | 'Salinity Widget'
    | 'Magnesium Widget'
    | 'Sodium Widget'
    | 'Nitrate Nitrogen Widget'
    | 'Phosphate Phosphorus Widget'
    | 'Potassium Widget'
    | 'Zinc Widget'
    | 'Iron Widget'
    | 'Organic Matter Widget'
    | 'Insights';
  widgetMetadata: { i: string; x: number; y: number };
}) {
  try {
    const [result] = await db.insert(widget).values(data).returning();
    return result;
  } catch (error) {
    logger.error('Failed to create widget:', error);
    return null;
  }
}

/**
 * Updates a widget.
 * @param id - Widget ID
 * @param data - Fields to update
 * @returns The updated widget or null
 */
export async function updateWidget(
  id: number,
  data: {
    managementZone?: number;
    name?:
      | 'Macro Radar'
      | 'Calcium Widget'
      | 'PH Widget'
      | 'Salinity Widget'
      | 'Magnesium Widget'
      | 'Sodium Widget'
      | 'Nitrate Nitrogen Widget'
      | 'Phosphate Phosphorus Widget'
      | 'Potassium Widget'
      | 'Zinc Widget'
      | 'Iron Widget'
      | 'Organic Matter Widget'
      | 'Insights';
    widgetMetadata?: { i: string; x: number; y: number };
  }
) {
  try {
    const [result] = await db
      .update(widget)
      .set(data)
      .where(eq(widget.id, id))
      .returning();
    return result;
  } catch (error) {
    logger.error('Failed to update widget:', error);
    return null;
  }
}

/**
 * Deletes a widget by ID.
 * @param id - Widget ID
 * @returns True if deleted successfully
 */
export async function deleteWidget(id: number) {
  try {
    await db.delete(widget).where(eq(widget.id, id));
    return true;
  } catch (error) {
    logger.error('Failed to delete widget:', error);
    return false;
  }
}
