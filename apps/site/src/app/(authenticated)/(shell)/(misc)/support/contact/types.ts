// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { z } from 'zod';
import type { contactSchema } from './schema';
import type { inferenceContactSchema } from './inference-schema';

/** Editable contact fields; sender and farm are always resolved on the server. */
export type ContactInput = z.infer<typeof contactSchema>;

/** Safe result returned by the authenticated contact action. */
export type ContactResult =
  { success: true; id: number } | { success: false; message: string };

/** Questions and optional zone captured when inference cannot answer. */
export type InferenceContactInput = z.infer<typeof inferenceContactSchema>;

/** Authorized, unsubmitted search context loaded from a short-lived draft. */
export interface InferenceContactContext {
  id: number;
  token: string;
  questions: string[];
  managementZone: { id: number; name: string } | null;
}

/** The handoff returns a question-free URL or a recoverable error. */
export type InferenceContactResult =
  { success: true; url: string } | { success: false; message: string };
