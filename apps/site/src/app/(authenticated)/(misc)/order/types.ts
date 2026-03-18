// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Placeholder checkout form values used by the local order screen. */
export interface CheckoutFormValues {
  /** Cardholder name entered during the placeholder checkout flow */
  cardholderName: string;
  /** Raw card number field value */
  cardNumber: string;
  /** Expiration value entered by the customer */
  expiration: string;
  /** CVV field value entered by the customer */
  cvv: string;
}
