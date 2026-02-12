// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { widget, widgetEnum } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { eq } from 'drizzle-orm';
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
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }

    if (!result.id) {
      return { error: 'No user id present in database' };
    }

    const [newWidget] = await db
      .insert(widget)
      .values({
        tab: tabId,
        name,
        widgetMetadata: widgetMetadata || null,
      })
      .returning();

    return { data: { widgetId: newWidget.id } };
  } catch (error) {
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
    const currentUser = await getAuthenticatedInfo();

    if ('error' in currentUser) {
      return { error: currentUser.error };
    }

    if (!currentUser.id) {
      return { error: 'No user id present in database' };
    }

    await db.delete(widget).where(eq(widget.id, widgetId));

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to delete widget' };
  }
}
