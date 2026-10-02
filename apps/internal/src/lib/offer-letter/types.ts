// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Inputs needed to render an offer packet. */
export interface OfferLetterInput {
  /** Candidate's full legal name. */
  name: string;
  /** Position title. */
  position: string;
  /** Mailing address lines, including the city/state/ZIP line. */
  addressLines: string[];
  /** Letter date, ISO `YYYY-MM-DD`. */
  letterDate: string;
  /** Offer acceptance deadline, ISO `YYYY-MM-DD`. */
  acceptByDate: string;
  /** Employment start date, ISO `YYYY-MM-DD`. */
  startDate: string;
  /** Employment end date, ISO `YYYY-MM-DD`. */
  endDate: string;
  /** Work location description. */
  location: string;
  /** Annual base salary in whole USD. */
  annualBaseSalary: number;
  /** One-time signing bonus in whole USD. */
  signingBonus: number;
  /** Equity grant as a percentage from 0 through 100. */
  equityPercentage: number;
}
