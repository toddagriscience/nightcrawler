// Copyright © Todd Agriscience, Inc. All rights reserved.

export interface AccountContact {
  name: string;
  email: string;
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

export interface AccountManagementData {
  sectionTitle: string;
  nickname: string;
}
