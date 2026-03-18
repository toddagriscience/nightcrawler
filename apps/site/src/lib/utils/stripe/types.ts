// Copyright © Todd Agriscience, Inc. All rights reserved.

export type StripeSubscriptionData = {
  renewal: string;
  billingCycle: string;
  nextBillingDate: string;
  nextPayment: string;
  paymentMethod: string;
};
