// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { isVerified } from '@/lib/auth';
import {
  accountAgreementAcceptance,
  farm,
  farmLocation,
  managementZone,
  user,
} from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import type {
  FarmLocationSelect,
  FarmSelect,
  ManagementZoneSelect,
  UserSelect,
} from '@/lib/types/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, desc, eq } from 'drizzle-orm';
import {
  formatMailingAddress,
  formatPhysicalLocation,
  NOT_SET,
  toDisplayDate,
  toDisplayName,
  toDisplayValue,
} from './util';

export async function getAccountShellData(): Promise<{ farmName: string }> {
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
      approved: user.approved,
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
    name: toDisplayName(
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
