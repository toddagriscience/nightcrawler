// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Fields collected by the offer letter form. */
export interface OfferLetterFormData {
  /** Full legal name of the hiree */
  name: string;
  /** Mailing address of the hiree (multi-line) */
  address: string;
  /** Employment start date, ISO `YYYY-MM-DD` */
  startDate: string;
  /** Employment end date, ISO `YYYY-MM-DD` */
  endDate: string;
}
