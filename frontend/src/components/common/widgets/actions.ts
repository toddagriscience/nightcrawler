// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { widget, widgetEnum } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import { WidgetUpdate } from '@/lib/types/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';
import { LayoutItem } from 'react-grid-layout';

/** Create a new widget for a given tab.
 *
 * @param tabId - The ID of the tab to create the widget for
 * @param name - The type/name of the widget to create
 * @param widgetMetadata - Optional layout metadata for the widget
 * */
export async function createWidget({
  tabId,
  name,
  widgetMetadata,
}: {
  tabId: number;
  name: (typeof widgetEnum.enumValues)[number];
  widgetMetadata?: LayoutItem;
}): Promise<{ data?: { widgetId: number }; error?: string | null }> {
  try {
    await getAuthenticatedInfo();

    // Place the widget at the top left, let RGL handle it
    const newWidgetMetadata = {
      x: 0,
      y: 0,
      i: name,
    };

    const [newWidget] = await db
      .insert(widget)
      .values({
        tab: tabId,
        name,
        widgetMetadata: widgetMetadata || newWidgetMetadata,
      })
      .returning();

    return { data: { widgetId: newWidget.id } };
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create widget' };
  }
}

/** Delete a widget by its ID.
 *
 * @param widgetId - The ID of the widget to delete
 * */
export async function deleteWidget(widgetId: number): Promise<ActionResponse> {
  try {
    await getAuthenticatedInfo();

    await db.delete(widget).where(eq(widget.id, widgetId));

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to delete widget' };
  }
}

/** Update a widget by its name and tab ID.
 *
 * @param tabId - The ID of the tab the widget belongs to
 * @param name - The name/type of the widget to update
 * @param updates - The fields to update on the widget
 * */
export async function updateWidget(
  tabId: number,
  name: (typeof widgetEnum.enumValues)[number],
  updates: WidgetUpdate
): Promise<ActionResponse> {
  try {
    await getAuthenticatedInfo();

    await db
      .update(widget)
      .set(updates)
      .where(and(eq(widget.tab, tabId), eq(widget.name, name)));

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update widget' };
  }
}
