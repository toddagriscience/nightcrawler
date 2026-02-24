// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { UserSelect } from '@/lib/types/db';

type AccountContactDbFields = Pick<UserSelect, 'email' | 'phone'>;

export interface AccountContact extends Omit<AccountContactDbFields, 'phone'> {
  name: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface AccountShellData {
  farmName: string;
}

export interface AccountUsersData {
  principalOperator: AccountContact;
  owner: AccountContact | null;
}

export interface AccountFarmData {
  nickname: string;
  legalName: string;
  physicalLocation: string;
  mailingAddress: string;
  clientSince: string;
}
