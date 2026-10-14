// Copyright © Todd Agriscience, Inc. All rights reserved.

/** A client's authenticated message as displayed in the internal inbox. */
export interface ClientInquiry {
  id: number;
  farmId: number | null;
  farmName: string;
  subject: string;
  message: string;
  senderName: string;
  senderEmail: string;
  createdAt: Date;
  reviewedAt: Date | null;
}

/** Result of marking one client inquiry handled. */
export type HandleInquiryResult =
  { success: true } | { success: false; message: string };
