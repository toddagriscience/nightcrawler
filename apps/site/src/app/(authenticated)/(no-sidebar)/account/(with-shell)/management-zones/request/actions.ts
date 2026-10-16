// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  createManagementZoneRequest,
  getManagementZoneRequests,
} from '@nightcrawler/db/queries';
import {
  ManagementZoneRequestError,
  type ManagementZoneRequestInput,
} from '@nightcrawler/db/utils/management-zone-request';
import { logger } from '@/lib/logger';
import { assertCanEditFarm } from '@/lib/utils/farm-rbac';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { revalidatePath } from 'next/cache';

/** Creates a zone request for the authenticated farm Admin, never a soil analysis. */
export async function requestManagementZone(input: ManagementZoneRequestInput) {
  try {
    const actor = await getAuthenticatedInfo();
    assertCanEditFarm(actor, 'request-management-zone');
    const request = await createManagementZoneRequest(
      { id: actor.id, farmId: actor.farmId },
      input
    );
    revalidatePath('/');
    revalidatePath('/account/management-zones');
    return { success: true as const, zoneId: request.zoneId };
  } catch (error) {
    logger.error('Unable to request management zone', { error });
    return {
      success: false as const,
      error:
        error instanceof ManagementZoneRequestError
          ? error.message
          : 'Unable to submit your request. Please try again.',
    };
  }
}

/** Loads request progress only for the farm resolved from the current session. */
export async function getFarmManagementZoneRequests() {
  const actor = await getAuthenticatedInfo();
  return getManagementZoneRequests(actor.farmId);
}
