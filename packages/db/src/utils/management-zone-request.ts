// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Reserved slug for authenticated management-zone requests. */
export const MANAGEMENT_ZONE_REQUEST_SLUG = 'management-zone-request';

/** Expected request validation or workflow error safe to display to the caller. */
export class ManagementZoneRequestError extends Error {}

/** Client-editable details collected before a soil sample is processed. */
export interface ManagementZoneRequestInput {
  /** Client's zone nickname. */
  name: string;
  /** Address or description that helps the advisor identify the parcel. */
  location: string;
  /** Optional parcel area in acres. */
  acreage?: number | null;
}

/** Staff-maintained progress of a sample request, independent of analysis state. */
export type ManagementZoneRequestStage =
  'requested' | 'sample_kit_sent' | 'processed';

/** Request details stored in a generic form submission's answers. */
export interface ManagementZoneRequestAnswers extends ManagementZoneRequestInput {
  /** Zone created by the authenticated request action. */
  zoneId: number;
  /** Requester resolved from the authenticated session. */
  requestedByUserId: number;
  /** Progress changed only by an active internal account. */
  stage: ManagementZoneRequestStage;
  /** Time staff recorded shipping the sample kit. */
  sampleKitSentAt?: string;
  /** Time staff recorded processing a zone with an analysis. */
  processedAt?: string;
}

/** Validates and selects only the details a client is allowed to submit. */
export function parseManagementZoneRequestInput(
  input: unknown
): ManagementZoneRequestInput {
  if (!input || typeof input !== 'object') {
    throw new ManagementZoneRequestError('Enter the management zone details.');
  }
  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const location = typeof raw.location === 'string' ? raw.location.trim() : '';
  if (!name || name.length > 200) {
    throw new ManagementZoneRequestError(
      'Enter a zone name of 200 characters or fewer.'
    );
  }
  if (!location || location.length > 1000) {
    throw new ManagementZoneRequestError(
      'Enter a location of 1,000 characters or fewer.'
    );
  }
  const acreage = raw.acreage ?? null;
  if (
    acreage !== null &&
    (typeof acreage !== 'number' ||
      !Number.isFinite(acreage) ||
      acreage <= 0 ||
      acreage > 1_000_000)
  ) {
    throw new ManagementZoneRequestError(
      'Enter an acreage greater than zero and no more than 1,000,000.'
    );
  }
  return { name, location, acreage };
}

/** Reads a recognized request without trusting arbitrary generic form answers. */
export function readManagementZoneRequestAnswers(
  answers: Record<string, unknown>
): ManagementZoneRequestAnswers | null {
  try {
    const details = parseManagementZoneRequestInput(answers);
    if (
      !Number.isInteger(answers.zoneId) ||
      Number(answers.zoneId) <= 0 ||
      !Number.isInteger(answers.requestedByUserId) ||
      Number(answers.requestedByUserId) <= 0 ||
      !['requested', 'sample_kit_sent', 'processed'].includes(
        String(answers.stage)
      )
    ) {
      return null;
    }
    return {
      ...details,
      zoneId: Number(answers.zoneId),
      requestedByUserId: Number(answers.requestedByUserId),
      stage: answers.stage as ManagementZoneRequestStage,
      ...(typeof answers.sampleKitSentAt === 'string'
        ? { sampleKitSentAt: answers.sampleKitSentAt }
        : {}),
      ...(typeof answers.processedAt === 'string'
        ? { processedAt: answers.processedAt }
        : {}),
    };
  } catch {
    return null;
  }
}
