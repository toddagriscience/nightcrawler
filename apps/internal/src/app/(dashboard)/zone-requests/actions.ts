// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import {
  advanceManagementZoneRequest,
  getManagementZoneRequests,
} from '@nightcrawler/db/queries';
import { requireInternalAccount } from '@/lib/require-internal-account';
import { revalidatePath } from 'next/cache';
import logger from '@/lib/logger';
import { ManagementZoneRequestError } from '@nightcrawler/db/utils/management-zone-request';

/** Lists sample requests for an active internal account. */
export async function getZoneRequests() {
  await requireInternalAccount();
  return getManagementZoneRequests();
}

/** Records a staff-controlled shipment or processing step. */
export async function updateZoneRequest(
  id: number,
  step: 'sample_kit_sent' | 'processed'
) {
  const actor = await requireInternalAccount();
  try {
    await advanceManagementZoneRequest(id, step, actor.id);
    revalidatePath('/zone-requests');
    return { success: true as const };
  } catch (error) {
    logger.error('Unable to update management zone request', error);
    return {
      success: false as const,
      error:
        error instanceof ManagementZoneRequestError
          ? error.message
          : 'Unable to update the request. Please try again.',
    };
  }
}
