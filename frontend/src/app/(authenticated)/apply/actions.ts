// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getUserEmail } from '@/lib/auth';
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
