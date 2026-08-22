// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  farm,
  farmLocation,
  managementZone,
  user,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import type {
  FarmLocationSelect,
  FarmSelect,
  ManagementZoneSelect,
  UserSelect,
} from '@/lib/types/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { NOT_SET, toDisplayName, toDisplayValue } from './util';

export async function getAccountShellData(): Promise<{
  farmName: string;
}> {
  const currentUser = await getAuthenticatedInfo();

  const [farmRecord] = await db
    .select({
      informalName: farm.informalName,
      businessName: farm.businessName,
    })
    .from(farm)
    .where(eq(farm.id, currentUser.farmId))
    .limit(1);

  const informalName = toDisplayValue(farmRecord?.informalName);
  const businessName = toDisplayValue(farmRecord?.businessName);

  return {
    farmName: informalName !== NOT_SET ? informalName : businessName,
  };
}

/**
 * Loads the contact details shown on the account users page: the authenticated
 * user (the principal operator) and one other farm user treated as the owner.
 *
 * Both contacts expose `firstName` holding the full display name, matching what
 * the account users page renders.
 *
 * @returns The principal operator's display name, email and phone, plus the
 * owner's when another farm user exists, otherwise `null`.
 */
export async function getAccountUsersData(): Promise<{
  principalOperator: Partial<UserSelect>;
  owner: Partial<UserSelect> | null;
}> {
  const currentUser = await getAuthenticatedInfo();

  const farmUsers = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })
    .from(user)
    .where(eq(user.farmId, currentUser.farmId))
    .orderBy(asc(user.id));

  const principalOperator = farmUsers.find(
    (farmUser) => farmUser.id === currentUser.id
  );
  const ownerUser =
    farmUsers.find(
      (farmUser) => farmUser.role === 'Admin' && farmUser.id !== currentUser.id
    ) ?? farmUsers.find((farmUser) => farmUser.id !== currentUser.id);

  const principalContact = {
    firstName: toDisplayName(
      principalOperator?.firstName,
      principalOperator?.lastName
    ),
    email: toDisplayValue(principalOperator?.email),
    phone: toDisplayValue(principalOperator?.phone),
  };

  return {
    principalOperator: principalContact,
    owner: ownerUser
      ? {
          firstName: toDisplayName(ownerUser.firstName, ownerUser.lastName),
          email: toDisplayValue(ownerUser.email),
          phone: toDisplayValue(ownerUser.phone),
        }
      : null,
  };
}

/**
 * Loads the farm record and its mailing location for the authenticated user's
 * farm, for the account overview page.
 *
 * @returns The farm row plus its joined `farm_location` row, or `null` when the
 * farm has no location on file.
 * @throws Triggers Next.js `notFound()` when no farm row matches the
 * authenticated user's `farmId`, so the page renders the 404 boundary instead
 * of a 500.
 */
export async function getAccountFarmData(): Promise<{
  farm: FarmSelect;
  location: FarmLocationSelect | null;
}> {
  const currentUser = await getAuthenticatedInfo();

  const [farmRecord] = await db
    .select()
    .from(farm)
    .leftJoin(farmLocation, eq(farmLocation.farmId, farm.id))
    .where(eq(farm.id, currentUser.farmId))
    .limit(1);

  if (!farmRecord) {
    notFound();
  }

  return { farm: farmRecord.farm, location: farmRecord.farm_location };
}

export async function getManagementZones(): Promise<ManagementZoneSelect[]> {
  const currentUser = await getAuthenticatedInfo();

  const zones = await db
    .select()
    .from(managementZone)
    .where(eq(managementZone.farmId, currentUser.farmId))
    .orderBy(asc(managementZone.name));

  return zones;
}
