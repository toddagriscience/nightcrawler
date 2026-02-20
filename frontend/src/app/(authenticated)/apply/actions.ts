// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { inviteUser } from '@/lib/auth';
import {
  accountAgreementAcceptance,
  farm,
  farmCertificate,
  farmInfoInternalApplication,
  farmLocation,
  user,
} from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import {
  FarmCertificateInsert,
  FarmInfoInternalApplicationInsert,
  FarmInsert,
  FarmLocationInsert,
  UserInsert,
} from '@/lib/types/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import {
  farmInfoInternalApplicationInsertSchema,
  userInsertSchema,
} from '@/lib/zod-schemas/db';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import z from 'zod';
import termsAndConditionsVersion from './terms-and-conditions-version';
import {
  GeneralBusinessInformationInsert,
  generalBusinessInformationInsertSchema,
} from './types';

/** Saves general business information to the farm, farmLocation, and farmCertificate tables.
 *
 * @param {FormData} formData - Data from the form submission.
 * @returns {ActionResponse} - Returns nothing if successful, returns an error if else.
 */
export async function saveGeneralBusinessInformation(
  formData: GeneralBusinessInformationInsert
) {
  try {
    const result = await getAuthenticatedInfo();
    const farmId = result.farmId;

    if (!farmId) {
      return { error: 'User is not associated with a farm' };
    }

    const validated = generalBusinessInformationInsertSchema.safeParse({
      ...formData,
      farmId,
    });

    if (!validated.success) {
      return { error: z.treeifyError(validated.error) };
    }

    // As far as I'm aware, manually picking these fields out is the best way to go about this.
    const farmInfo: FarmInsert = {
      ...validated.data,
    };
    const farmLocationInfo: FarmLocationInsert = {
      ...validated.data,
    };
    const farmCertificates: FarmCertificateInsert = {
      ...validated.data,
    };

    // Update the farm table. Guaranteed to already exist.
    await db
      .update(farm)
      .set({
        ...farmInfo,
      })
      .where(eq(farm.id, farmId));

    // Upsert farmLocation
    const existingLocation = await db
      .select({ farmId: farmLocation.farmId })
      .from(farmLocation)
      .where(eq(farmLocation.farmId, farmId))
      .limit(1);

    if (existingLocation.length > 0) {
      await db
        .update(farmLocation)
        .set({
          ...farmLocationInfo,
        })
        .where(eq(farmLocation.farmId, farmId));
    } else {
      await db.insert(farmLocation).values({
        ...farmLocationInfo,
      });
    }

    // Upsert farmCertificate
    const existingCertificate = await db
      .select({ id: farmCertificate.id })
      .from(farmCertificate)
      .where(eq(farmCertificate.farmId, farmId))
      .limit(1);

    if (existingCertificate.length > 0) {
      await db
        .update(farmCertificate)
        .set(farmCertificates)
        .where(eq(farmCertificate.id, existingCertificate[0].id));
    } else {
      await db.insert(farmCertificate).values(farmCertificates);
    }

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}

/** Creates or updates an internal application based off of the given information. All fields are optional.
 *
 * @param {FarmInfoInternalApplicationInsert} formData - Data from the form submission.
 * @returns {ActionResponse} - Returns nothing if successful, returns an error if else.
 * */
export async function saveApplication(
  formData: FarmInfoInternalApplicationInsert
): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();
    const farmId = result.farmId;

    if (!farmId) {
      return { error: 'User is not associated with a farm' };
    }

    const validated = farmInfoInternalApplicationInsertSchema
      .omit({
        createdAt: true,
        updatedAt: true,
      })
      .safeParse({ ...formData, farmId });

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
        .set(validated.data)
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

/** Sends an applicant's information to Google Sheets AND adds an entry to the database for their acceptance. ONLY call this function if the user has accepted the Terms and Conditions. This isn't a long term solution, but it'll work for now.
 *
 * @returns {ActionResponse} - Returns nothing if successful, returns an error if else.
 * */
export async function submitApplication(): Promise<ActionResponse> {
  // Get user information for `accountAgreementAcceptance` at the very start of the action for best accuracy
  const timeAccepted = new Date();
  const requestHeaders = await headers();
  const userIpAddress = requestHeaders.get('x-forwarded-for');

  try {
    const result = await getAuthenticatedInfo();
    const farmId = result.farmId;

    if (!farmId) {
      return { error: 'User is not associated with a farm' };
    }

    const applicationData = await db
      .select()
      .from(farmInfoInternalApplication)
      .where(eq(farmInfoInternalApplication.farmId, farmId))
      .limit(1);

    if (!applicationData) {
      return { error: 'Application not found' };
    }

    await db.insert(accountAgreementAcceptance).values({
      timeAccepted,
      // This is fine, we don't desperately need the user's IP
      ipAddress: userIpAddress || 'NO x-forwarded-for HEADER GIVEN',
      userId: result.id,
      accepted: true,
      version: termsAndConditionsVersion,
    });

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
 * @param {UserInsert} formData - The user's information, validated by a Zod schema generated from the Drizzle schema
 * @returns {Promise<ActionResponse>} - Returns nothing if successful, returns an error if else. */
export async function inviteUserToFarm(
  formData: UserInsert
): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();
    const farmId = result.farmId;

    if (!farmId) {
      return { error: 'User is not associated with a farm' };
    }

    // Multiple admins aren't allowed
    const [doesAdminExist] = await db
      .select({ role: user.role })
      .from(user)
      .where(and(eq(user.role, 'Admin'), eq(user.farmId, farmId)))
      .limit(1);

    if (doesAdminExist && formData.role === 'Admin') {
      return {
        error:
          'Multiple administrators are not allowed. Please contact support for more information.',
      };
    }

    // Multiple users aren't allowed
    const [doesViewerExist] = await db
      .select({ role: user.role })
      .from(user)
      .where(and(eq(user.role, 'Viewer'), eq(user.farmId, farmId)))
      .limit(1);

    if (doesViewerExist && formData.role === 'Viewer') {
      return {
        error:
          'Multiple viewers are not allowed. Please contact support for more information.',
      };
    }

    // Don't require the user's new ID to be sent with formData
    const validated = userInsertSchema.omit({ id: true }).safeParse(formData);
    if (!validated.success) {
      return { error: z.treeifyError(validated.error) };
    }

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
