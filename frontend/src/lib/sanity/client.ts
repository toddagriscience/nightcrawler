// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: '3x7sixjh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
