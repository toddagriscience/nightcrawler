// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail, inviteUser } from '@/lib/auth';
import { db, farmInfoInternalApplication, user } from '@/lib/db/schema';
import { ActionResponse } from '@/lib/types/action-response';
import { FarmInfoInternalApplicationInsert } from '@/lib/types/db';
import { eq } from 'drizzle-orm';
import {
  parseJsonField,
  parseStringField,
  parseIntegerField,
  parseNumericField,
} from '@/lib/utils/form-data-handling';
import { submitToGoogleSheets } from '@/lib/actions/googleSheets';
import { userInsertSchema } from '@/lib/zod-schemas/db';

/** Creates or updates an internal application based off of the given information. All fields are optional.
 *
 * @param {FormData} formData - Data from the form submission.
 * @returns {ActionResponse} - Returns nothing if successful, returns an error if else.
 * */
export async function saveApplication(
  formData: FormData
): Promise<ActionResponse> {
  // Don't process any data before we ensure that the user is authenticated
  const email = await getUserEmail();

  if (!email) {
    return { error: "No email registered with this user's account" };
  }

  try {
    const [currentUser] = await db
      .select({ farmId: user.farmId })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      return { error: 'User not found' };
    }

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    const farmId = currentUser.farmId;

    // Extract all fields from formData
    const toInsertInfo: Omit<
      FarmInfoInternalApplicationInsert,
      'farmId' | 'createdAt' | 'updatedAt'
    > = {
      splitOperation: parseJsonField(formData.get('splitOperation')),
      alternateFarming: parseJsonField(formData.get('alternateFarming')),
      totalGrossIncome: parseNumericField(formData.get('totalGrossIncome')),
      conservationPlan: parseStringField(formData.get('conservationPlan')),
      mainCrops: parseStringField(formData.get('mainCrops')),
      totalAcreage: parseIntegerField(formData.get('totalAcreage')),
      managementZoneStructure: parseStringField(
        formData.get('managementZoneStructure')
      ),
      farmActivites: parseJsonField(formData.get('farmActivites')),
      productionLocation: parseJsonField(formData.get('productionLocation')),
      cultivationPractices: parseJsonField(
        formData.get('cultivationPractices')
      ),
      livestockIncorporation: parseStringField(
        formData.get('livestockIncorporation')
      ),
      weedInsectDiseasesControl: parseStringField(
        formData.get('weedInsectDiseasesControl')
      ),
      pestControl: parseJsonField(formData.get('pestControl')),
      offFarmProducts: parseJsonField(formData.get('offFarmProducts')),
      otherMaterials: parseJsonField(formData.get('otherMaterials')),
      mechanicalEquipment: parseStringField(
        formData.get('mechanicalEquipment')
      ),
      supplierContracts: parseStringField(formData.get('supplierContracts')),
      irrigationWaterSource: parseJsonField(
        formData.get('irrigationWaterSource')
      ),
      irrigationScheduling: parseStringField(
        formData.get('irrigationScheduling')
      ),
      soilMoistureMonitoring: parseStringField(
        formData.get('soilMoistureMonitoring')
      ),
      irrigationMaterials: parseStringField(
        formData.get('irrigationMaterials')
      ),
      waterConservation: parseStringField(formData.get('waterConservation')),
      waterQualityProtection: parseStringField(
        formData.get('waterQualityProtection')
      ),
      erosionPrevention: parseStringField(formData.get('erosionPrevention')),
      nearContaminationSource: parseJsonField(
        formData.get('nearContaminationSource')
      ),
      activeWildAreas: parseJsonField(formData.get('activeWildAreas')),
      naturalResources: parseStringField(formData.get('naturalResources')),
      manageHarvests: parseJsonField(formData.get('manageHarvests')),
      waterUsedPostHarvest: parseJsonField(
        formData.get('waterUsedPostHarvest')
      ),
      primaryMarketVenues: parseJsonField(formData.get('primaryMarketVenues')),
      branding: parseJsonField(formData.get('branding')),
      productDifferentiation: parseJsonField(
        formData.get('productDifferentiation')
      ),
    };

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
          ...toInsertInfo,
          updatedAt: new Date(),
        })
        .where(eq(farmInfoInternalApplication.farmId, farmId));
    } else {
      await db.insert(farmInfoInternalApplication).values({
        farmId,
        ...toInsertInfo,
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
  // Don't process any data before we ensure that the user is authenticated
  const email = await getUserEmail();

  if (!email) {
    return { error: "No email registered with this user's account" };
  }

  try {
    const [currentUser] = await db
      .select({ farmId: user.farmId })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      return { error: 'User not found' };
    }

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    const farmId = currentUser.farmId;

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
  // Don't process any data before we ensure that the user is authenticated
  const email = await getUserEmail();

  if (!email) {
    return { error: "No email registered with this user's account" };
  }

  // Don't require the user's new ID to be sent with formData
  const formDataObject = Object.fromEntries(formData);
  const validated = userInsertSchema
    .omit({ id: true })
    .safeParse(formDataObject);

  if (!validated.success) {
    return { error: 'Invalid form data' };
  }

  try {
    const [currentUser] = await db
      .select({ farmId: user.farmId })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!currentUser) {
      return { error: 'User not found' };
    }

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    const farmId = currentUser.farmId;
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
