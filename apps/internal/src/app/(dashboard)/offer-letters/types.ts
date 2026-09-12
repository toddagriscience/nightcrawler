// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Structured mailing address, collected field-by-field so output is consistent. */
export interface OfferLetterAddress {
  /** Street address, e.g. "123 Main St" */
  street: string;
  /** Apartment, suite, unit — optional */
  line2: string;
  /** City */
  city: string;
  /** Two-letter US state code */
  state: string;
  /** ZIP code, `12345` or `12345-6789` */
  zip: string;
}

/** Fields collected by the offer letter form. */
export interface OfferLetterFormData {
  /** Full legal name of the hiree */
  name: string;
  /** Position title, e.g. "Software Engineer Intern" */
  position: string;
  /** Hiree mailing address */
  address: OfferLetterAddress;
  /** Employment start date, ISO `YYYY-MM-DD` */
  startDate: string;
  /** Employment end date, ISO `YYYY-MM-DD` */
  endDate: string;
  /** Annual base salary in USD */
  annualBaseSalary: number;
  /** One-time signing bonus in USD */
  signingBonus: number;
  /** Equity grant, in units/shares */
  equity: number;
}
