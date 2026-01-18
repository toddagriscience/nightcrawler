// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db, farmInfoInternalApplication } from '@/lib/db/schema';
import { ActionResponse } from '@/lib/types/action-response';
import { eq } from 'drizzle-orm';
import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import { farmInfoInternalApplicationInsertSchema } from '@/lib/zod-schemas/db';
import { getAuthenticatedUserFarmId } from '@/lib/utils/get-authenticated-user-farm-id';
import z from 'zod';

/** Creates or updates an internal application based off of the given information. All fields are optional.
 *
 * @param {FormData} formData - Data from the form submission.
 * @returns {ActionResponse} - Returns nothing if successful, returns an error if else.
 * */
export async function saveApplication(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedUserFarmId();

    if (!result.data) {
      return result;
    }

    if (!('farmId' in result.data)) {
      return { error: 'No farm ID given' };
    }

    const farmId = result.data.farmId as number;
    const formDataObject = Object.fromEntries(formData);
    const validated = farmInfoInternalApplicationInsertSchema
      .omit({
        createdAt: true,
        updatedAt: true,
      })
      .safeParse({ ...formDataObject, farmId });

    if (!validated.success) {
      return { error: z.treeifyError(validated.error) };
    }

    // Does farmInfoInternalApplication exist yet for this farm?
    const existingApplication = await db
      .select({ farmId: farmInfoInternalApplication.farmId })
      .from(farmInfoInternalApplication)
      .where(eq(farmInfoInternalApplication.farmId, farmId))
      .limit(1);

    if (existingApplication.length > 0) {
      await db
        .update(farmInfoInternalApplication)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(farmInfoInternalApplication.farmId, farmId));
    } else {
      await db.insert(farmInfoInternalApplication).values({
        ...validated.data,
      });
    }

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}

/** Sends an applicant's information to Google Sheets. This isn't a long term solution, but it'll work for now.
 *
 * @returns {ActionResponse} - Returns nothing if successful, returns an error if else.
 * */
export async function sendApplicationToGoogleSheets(): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedUserFarmId();

    if (!result.data) {
      return result;
    }

    if (!('farmId' in result.data)) {
      return { error: 'No farm ID given' };
    }

    const farmId = result.data.farmId as number;
    const applicationData = await db
      .select()
      .from(farmInfoInternalApplication)
      .where(eq(farmInfoInternalApplication.farmId, farmId))
      .limit(1);

    if (!applicationData) {
      return { error: 'Application not found' };
    }

    const googleSheetsUrl = process.env.INTERNAL_APPLICATION_GOOGLE_SCRIPT_URL!;

    await submitToGoogleSheets(applicationData[0], googleSheetsUrl);

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
