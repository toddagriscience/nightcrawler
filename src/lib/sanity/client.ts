import { createClient } from 'next-sanity';

export const client = createClient({
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    'Missing env variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'Missing env variable: NEXT_PUBLIC_SANITY_DATASET',
  apiVersion: '2024-01-01',
  useCdn: false,
});
