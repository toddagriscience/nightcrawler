// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { inviteUser } from '@/lib/auth-server';
import {
  accountAgreementAcceptance,
  farm,
  farmCertificate,
  farmInfoInternalApplication,
  farmLocation,
  farmSubscription,
  user,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { env } from '@/lib/env';
import logger from '@/lib/logger';
import { getStripeClient } from '@/lib/stripe/client';
import { ActionResponse } from '@/lib/types/action-response';
import {
  FarmCertificateInsert,
  FarmInfoInternalApplicationInsert,
  FarmInsert,
  FarmLocationInsert,
  UserInsert,
} from '@/lib/types/db';
import { assertCanEditFarm } from '@/lib/utils/farm-rbac';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import {
  farmInfoInternalApplicationInsertSchema,
  userInsertSchema,
} from '@/lib/zod-schemas/db';
import { throwActionError } from '@/lib/utils/actions';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import z from 'zod';
import { isApplicationReadyForSubmission } from './db';
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
    const currentUser = await getAuthenticatedInfo();
    const farmId = currentUser.farmId;

    if (!farmId) {
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(currentUser, 'save-general-business-information');

    const validated = generalBusinessInformationInsertSchema.safeParse({
      ...formData,
      farmId,
    });

    if (!validated.success) {
      throwActionError(z.treeifyError(validated.error));
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

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
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
    const currentUser = await getAuthenticatedInfo();
    const farmId = currentUser.farmId;

    if (!farmId) {
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(currentUser, 'save-application');

    const validated = farmInfoInternalApplicationInsertSchema
      .omit({
        createdAt: true,
        updatedAt: true,
      })
      .safeParse({ ...formData, farmId });

    if (!validated.success) {
      throwActionError(z.treeifyError(validated.error));
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

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
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
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(result, 'submit-application');

    const canSubmit = await isApplicationReadyForSubmission(farmId);
    if (!canSubmit) {
      throwActionError(
        'Please complete General Business Information, Farm Information, and an active Platform License before submitting.'
      );
    }

    await db.insert(accountAgreementAcceptance).values({
      timeAccepted,
      // This is fine, we don't desperately need the user's IP
      ipAddress: userIpAddress || 'NO x-forwarded-for HEADER GIVEN',
      userId: result.id,
      accepted: true,
      version: termsAndConditionsVersion,
    });

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
  }
}

/** Creates a Stripe-hosted checkout session for the $2,000/month Platform License. */
export async function createStripeSubscriptionCheckoutSession(): Promise<ActionResponse> {
  const MONTHLY_SUBSCRIPTION_PRICE_USD_CENTS = 169_500;

  try {
    const stripe = getStripeClient();
    const currentUser = await getAuthenticatedInfo();
    const farmId = currentUser.farmId;

    assertCanEditFarm(
      currentUser,
      'create-stripe-subscription-checkout-session'
    );

    const [currentFarm] = await db
      .select({
        id: farm.id,
        stripeCustomerId: farm.stripeCustomerId,
        businessName: farm.businessName,
      })
      .from(farm)
      .where(eq(farm.id, farmId))
      .limit(1);

    if (!currentFarm) {
      throwActionError('Farm not found');
    }

    const [existingSubscription] = await db
      .select({ status: farmSubscription.status })
      .from(farmSubscription)
      .where(eq(farmSubscription.farmId, farmId))
      .limit(1);

    if (
      existingSubscription?.status &&
      ['active', 'trialing'].includes(existingSubscription.status)
    ) {
      throwActionError(
        'An active Platform License already exists for this farm.'
      );
    }

    let stripeCustomerId = currentFarm.stripeCustomerId;

    if (!stripeCustomerId) {
      const createdCustomer = await stripe.customers.create({
        email: currentUser.email,
        name: currentFarm.businessName ?? currentUser.firstName,
        metadata: {
          farmId: String(farmId),
          userId: String(currentUser.id),
        },
      });

      stripeCustomerId = createdCustomer.id;

      await db
        .update(farm)
        .set({
          stripeCustomerId,
        })
        .where(eq(farm.id, farmId));
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      metadata: {
        farmId: String(farmId),
        userId: String(currentUser.id),
      },
      subscription_data: {
        metadata: {
          farmId: String(farmId),
          userId: String(currentUser.id),
        },
        trial_period_days: 7,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: MONTHLY_SUBSCRIPTION_PRICE_USD_CENTS,
            recurring: {
              interval: 'month',
            },
            product_data: {
              name: 'Todd Platform License',
              description:
                'Monthly Platform License for Todd internal application',
            },
          },
        },
      ],
      success_url: `${env.baseUrl}`,
      cancel_url: `${env.baseUrl}`,
    });

    if (!session.url) {
      throwActionError('Unable to start Stripe checkout.');
    }

    return { data: { url: session.url } };
  } catch (error) {
    logger.error('Failed to create Stripe checkout session', { error });
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
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
    const currentUser = await getAuthenticatedInfo();
    const farmId = currentUser.farmId;

    if (!farmId) {
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(currentUser, 'invite-user-to-farm');

    // Multiple admins aren't allowed
    const [doesAdminExist] = await db
      .select({ role: user.role })
      .from(user)
      .where(and(eq(user.role, 'Admin'), eq(user.farmId, farmId)))
      .limit(1);

    if (doesAdminExist && formData.role === 'Admin') {
      throwActionError(
        'Multiple administrators are not allowed. Please contact support for more information.'
      );
    }

    // Multiple users aren't allowed
    const [doesViewerExist] = await db
      .select({ role: user.role })
      .from(user)
      .where(and(eq(user.role, 'Viewer'), eq(user.farmId, farmId)))
      .limit(1);

    if (doesViewerExist && formData.role === 'Viewer') {
      throwActionError(
        'Multiple viewers are not allowed. Please contact support for more information.'
      );
    }

    // Don't require the user's new ID to be sent with formData
    const validated = userInsertSchema.omit({ id: true }).safeParse(formData);
    if (!validated.success) {
      throwActionError(z.treeifyError(validated.error));
    }

    const didInvite = await inviteUser(
      validated.data.email,
      validated.data.firstName
    );

    if (didInvite instanceof Error) {
      throwActionError(didInvite.message);
    }

    // Insert user and return row so client has id for uninvite
    const [inserted] = await db
      .insert(user)
      .values({ ...validated.data, farmId })
      .returning();

    return { data: inserted ?? undefined };
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
  }
}
