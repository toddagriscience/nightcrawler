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
import { setCustomerDefaultPaymentMethod } from '@/lib/utils/stripe/subscription-db';
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
        'Please complete General Business Information, Farm Information, and Bank Information before submitting.'
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

/** Ensures the farm has a Stripe customer, creating one if needed.
 *
 * @returns {Promise<string>} The Stripe customer ID.
 */
async function ensureStripeCustomerForFarm(
  farmId: number,
  userId: number,
  userEmail: string,
  fallbackName: string
): Promise<string> {
  const stripe = getStripeClient();

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

  if (currentFarm.stripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(
        currentFarm.stripeCustomerId
      );
      if (!existing.deleted) {
        return existing.id;
      }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !('code' in error) ||
        error.code !== 'resource_missing'
      ) {
        throw error;
      }
      logger.warn(
        'Stored Stripe customer id no longer exists; creating a new one',
        {
          farmId,
          staleStripeCustomerId: currentFarm.stripeCustomerId,
        }
      );
    }
  }

  const createdCustomer = await stripe.customers.create({
    email: userEmail,
    name: currentFarm.businessName ?? fallbackName,
    metadata: {
      farmId: String(farmId),
      userId: String(userId),
    },
  });

  await db
    .update(farm)
    .set({ stripeCustomerId: createdCustomer.id })
    .where(eq(farm.id, farmId));

  return createdCustomer.id;
}

/** Creates a Stripe SetupIntent for collecting ACH Direct Debit bank info.
 *
 * The SetupIntent is attached to the farm's Stripe customer and is used to
 * collect payment method information for future off-session ACH charges. No
 * payment is taken at setup time.
 *
 * @returns {Promise<ActionResponse>} The SetupIntent `client_secret` for use
 *   with Stripe Elements.
 */
export async function createAchSetupIntent(): Promise<ActionResponse> {
  try {
    const stripe = getStripeClient();
    const currentUser = await getAuthenticatedInfo();
    const farmId = currentUser.farmId;

    assertCanEditFarm(currentUser, 'create-ach-setup-intent');

    const stripeCustomerId = await ensureStripeCustomerForFarm(
      farmId,
      currentUser.id,
      currentUser.email,
      currentUser.firstName
    );

    /**
     * We decided that we only let people verify their bank by
     * signing into it (Stripe Financial Connections).
     * We do not let them type in a routing/account number by hand. Those
     * hand-typed accounts have to be checked with tiny test deposits,
     * and if the customer never confirms the deposits we can't charge
     * them later. So we refuse anything else and tell people whose bank
     * isn't supported to contact us.
     */
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['us_bank_account'],
      usage: 'off_session',
      payment_method_options: {
        us_bank_account: {
          financial_connections: { permissions: ['payment_method'] },
          verification_method: 'instant',
        },
      },
      metadata: {
        farmId: String(farmId),
        userId: String(currentUser.id),
        purpose: 'application_ach_setup',
      },
    });

    if (!setupIntent.client_secret) {
      throwActionError('Unable to start bank information setup.');
    }

    return {
      data: {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      },
    };
  } catch (error) {
    logger.error('Failed to create ACH SetupIntent', { error });
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
  }
}

/** Records a successful ACH SetupIntent against the farm.
 *
 * Verifies the SetupIntent with Stripe (to prevent spoofed client calls),
 * then upserts a `farmSubscription` row with `status = 'bank_setup_complete'`
 * and the resulting payment method ID so the farm can be billed later.
 *
 * @param {string} setupIntentId - The Stripe SetupIntent ID returned by
 *   `createAchSetupIntent` and confirmed on the client.
 * @returns {Promise<ActionResponse>} Empty on success.
 */
export async function recordAchSetupComplete(
  setupIntentId: string
): Promise<ActionResponse> {
  try {
    if (!setupIntentId || typeof setupIntentId !== 'string') {
      throwActionError('A SetupIntent ID is required.');
    }

    const stripe = getStripeClient();
    const currentUser = await getAuthenticatedInfo();
    const farmId = currentUser.farmId;

    assertCanEditFarm(currentUser, 'record-ach-setup-complete');

    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    const metadataFarmId = Number(setupIntent.metadata?.farmId ?? '');
    if (!Number.isInteger(metadataFarmId) || metadataFarmId !== farmId) {
      throwActionError('SetupIntent does not belong to this farm.');
    }

    const paymentMethodId =
      typeof setupIntent.payment_method === 'string'
        ? setupIntent.payment_method
        : (setupIntent.payment_method?.id ?? null);

    /**
     * We only save the bank if Stripe says the SetupIntent is
     * `succeeded`. Because we forced the bank-sign-in flow, that's the
     * only "good" status we should ever see. Anything else means the
     * bank wasn't really verified, and we shouldn't pretend we have a
     * working account.
     */
    if (setupIntent.status !== 'succeeded' || !paymentMethodId) {
      throwActionError(
        `Bank information setup is not complete (status: ${setupIntent.status}).`
      );
    }

    const nowStatus = 'bank_setup_complete';

    // Reuse existing columns to avoid a schema migration:
    // - `stripeSubscriptionId` stores the SetupIntent ID (unique constraint
    //   is still satisfied; SetupIntent IDs are distinct from sub IDs).
    // - `stripePriceId` stores the payment method ID.
    await db
      .insert(farmSubscription)
      .values({
        farmId,
        status: nowStatus,
        stripeSubscriptionId: setupIntent.id,
        stripePriceId: paymentMethodId,
      })
      .onConflictDoUpdate({
        target: farmSubscription.farmId,
        set: {
          status: nowStatus,
          stripeSubscriptionId: setupIntent.id,
          stripePriceId: paymentMethodId,
          updatedAt: new Date(),
        },
      });

    /**
     * Tell Stripe that this new bank is the customer's default for
     * future invoices. That way the /account page can show it right
     * away, and any future subscription will bill the right account
     * without us asking the user again.
     */
    const stripeCustomerId =
      typeof setupIntent.customer === 'string'
        ? setupIntent.customer
        : (setupIntent.customer?.id ?? null);
    if (stripeCustomerId) {
      await setCustomerDefaultPaymentMethod(stripeCustomerId, paymentMethodId);
    }

    return {};
  } catch (error) {
    logger.error('Failed to record ACH SetupIntent completion', { error });
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
  }
}

/** Creates a Stripe-hosted checkout session for the paid Platform License.
 *
 * Not used during the application flow. Retained so a farm can optionally
 * subscribe later from an authenticated area of the site.
 */
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
