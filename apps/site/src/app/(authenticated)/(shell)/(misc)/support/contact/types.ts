// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { z } from 'zod';
import type { contactSchema } from './schema';

/** Editable contact fields; sender and farm are always resolved on the server. */
export type ContactInput = z.infer<typeof contactSchema>;

/** Safe result returned by the authenticated contact action. */
export type ContactResult =
  { success: true; id: number } | { success: false; message: string };
