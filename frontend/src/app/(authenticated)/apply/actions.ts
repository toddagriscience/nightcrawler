// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail, inviteUser } from '@/lib/auth';
import { db, farmInfoInternalApplication, user } from '@/lib/db/schema';
import { ActionResponse } from '@/lib/types/action-response';
import { eq } from 'drizzle-orm';
import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import { userInsertSchema } from '@/lib/zod-schemas/db';
import { farmInfoInternalApplicationInsertSchema } from '@/lib/zod-schemas/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
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
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }
    if (!result.farmId) {
      return { error: 'No farmId given' };
    }

    const farmId = result.farmId;
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
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }
    if (!result.farmId) {
      return { error: 'No farmId given' };
    }

    const farmId = result.farmId;
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

/** Invites a user to "join" the farm.
 *
 * @param {FormData} formData - The user's information, validated by a Zod schema generated from the Drizzle schema
 * @returns {Promise<ActionResponse>} - Returns nothing if successful, returns an error if else. */
export async function inviteUserToFarm(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }
    if (!result.farmId) {
      return { error: 'No farmId given' };
    }

    const formDataObject = Object.fromEntries(formData);
    // Don't require the user's new ID to be sent with formData
    const validated = userInsertSchema
      .omit({ id: true })
      .safeParse(formDataObject);
    if (!validated.success) {
      return { error: 'Invalid form data' };
    }

    const farmId = result.farmId;
    const didInvite = await inviteUser(
      validated.data.email,
      validated.data.firstName
    );

    if (didInvite instanceof Error) {
      return { error: didInvite.message };
    }

    // If inviteUser() succeeds, create a new user
    await db.insert(user).values({ ...validated.data, farmId });

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
