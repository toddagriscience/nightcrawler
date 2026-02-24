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
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { asc, desc, eq } from 'drizzle-orm';

interface AccountContact {
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface AccountShellData {
  farmName: string;
}

interface AccountUsersData {
  principalOperator: AccountContact;
  owner: AccountContact | null;
}

interface AccountFarmData {
  nickname: string;
  legalName: string;
  physicalLocation: string;
  mailingAddress: string;
  clientSince: string;
}

interface AccountManagementData {
  sectionTitle: string;
  nickname: string;
}

const NOT_SET = 'Not set';

function toDisplayValue(value?: string | null) {
  return value?.trim() || NOT_SET;
}

function toDisplayName(firstName?: string | null, lastName?: string | null) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  return fullName || NOT_SET;
}

function toDisplayDate(dateValue?: Date | string | null) {
  if (!dateValue) {
    return NOT_SET;
  }

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) {
    return NOT_SET;
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatPhysicalLocation(
  pointValue: [number, number] | null,
  countyState?: string | null
) {
  if (!pointValue && !countyState) {
    return NOT_SET;
  }

  const [longitude, latitude] = pointValue ?? [null, null];
  const coordinatePart =
    latitude != null && longitude != null
      ? `${latitude.toFixed(3)},${longitude.toFixed(3)}`
      : '';

  return (
    [coordinatePart, countyState].filter(Boolean).join(' ').trim() || NOT_SET
  );
}

function formatMailingAddress(location?: {
  address1: string | null;
  address2: string | null;
  address3: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}) {
  if (!location) {
    return NOT_SET;
  }

  const addressParts = [
    location.address1,
    location.address2,
    location.address3,
    location.state,
    location.postalCode,
    location.country,
  ].filter(Boolean);

  return addressParts.join(' ').trim() || NOT_SET;
}

export async function getAccountShellData(): Promise<AccountShellData> {
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

export async function getAccountUsersData(): Promise<AccountUsersData> {
  const currentUser = await getAuthenticatedInfo();
  const currentUserVerified = await isVerified();

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

  const principalContact: AccountContact = {
    name: toDisplayName(
      principalOperator?.firstName,
      principalOperator?.lastName
    ),
    email: toDisplayValue(principalOperator?.email),
    phone: toDisplayValue(principalOperator?.phone),
    emailVerified: currentUserVerified,
    phoneVerified: Boolean(principalOperator?.phone),
  };

  return {
    principalOperator: principalContact,
    owner: ownerUser
      ? {
          name: toDisplayName(ownerUser.firstName, ownerUser.lastName),
          email: toDisplayValue(ownerUser.email),
          phone: toDisplayValue(ownerUser.phone),
          emailVerified: Boolean(ownerUser.approved),
          phoneVerified: Boolean(ownerUser.phone),
        }
      : null,
  };
}

export async function getAccountFarmData(): Promise<AccountFarmData> {
  const currentUser = await getAuthenticatedInfo();

  const [farmRecord] = await db
    .select({
      informalName: farm.informalName,
      businessName: farm.businessName,
      location: farmLocation.location,
      countyState: farmLocation.countyState,
      address1: farmLocation.address1,
      address2: farmLocation.address2,
      address3: farmLocation.address3,
      state: farmLocation.state,
      postalCode: farmLocation.postalCode,
      country: farmLocation.country,
      farmCreatedAt: farm.createdAt,
    })
    .from(farm)
    .leftJoin(farmLocation, eq(farmLocation.farmId, farm.id))
    .where(eq(farm.id, currentUser.farmId))
    .limit(1);

  const [latestAgreement] = await db
    .select({
      acceptedAt: accountAgreementAcceptance.timeAccepted,
    })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, currentUser.id))
    .orderBy(desc(accountAgreementAcceptance.timeAccepted))
    .limit(1);

  return {
    nickname: toDisplayValue(farmRecord?.informalName),
    legalName: toDisplayValue(farmRecord?.businessName),
    physicalLocation: formatPhysicalLocation(
      farmRecord?.location ?? null,
      farmRecord?.countyState
    ),
    mailingAddress: formatMailingAddress(
      farmRecord
        ? {
            address1: farmRecord.address1,
            address2: farmRecord.address2,
            address3: farmRecord.address3,
            state: farmRecord.state,
            postalCode: farmRecord.postalCode,
            country: farmRecord.country,
          }
        : undefined
    ),
    clientSince: toDisplayDate(
      latestAgreement?.acceptedAt ??
        farmRecord?.farmCreatedAt ??
        currentUser.createdAt
    ),
  };
}

export async function getAccountManagementData(): Promise<AccountManagementData> {
  const currentUser = await getAuthenticatedInfo();

  const [firstZone] = await db
    .select({
      name: managementZone.name,
    })
    .from(managementZone)
    .where(eq(managementZone.farmId, currentUser.farmId))
    .orderBy(asc(managementZone.name))
    .limit(1);

  return {
    sectionTitle: 'Management zone 1',
    nickname: toDisplayValue(firstZone?.name),
  };
}
