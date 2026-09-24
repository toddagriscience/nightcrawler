// Copyright © Todd Agriscience, Inc. All rights reserved.

import { z } from 'zod';
import { offerLetterSchema } from './schema';

/** Fields collected by the offer packet form. */
export type OfferLetterFormData = z.infer<typeof offerLetterSchema>;

/** Structured candidate mailing address. */
export type OfferLetterAddress = OfferLetterFormData['address'];
