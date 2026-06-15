// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * ARCHIVED — local dev helper only; not used by production onboarding.
 *
 * Legacy PII-in-query URL generator from before platform-access signup moved to
 * `application_id` + `token` links. Kept for manual local experiments only.
 */

import readline from 'readline';

const BASE_URL = 'http://localhost:3000/incoming';

interface QueryParam {
  key: string;
  prompt: string;
}

const QUERY_PARAMS: QueryParam[] = [
  { key: 'first_name', prompt: 'First Name' },
  { key: 'last_name', prompt: 'Last Name' },
  { key: 'farm_name', prompt: 'Farm Name' },
  { key: 'email', prompt: 'Email' },
  { key: 'phone', prompt: 'Phone' },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main(): Promise<void> {
  console.log('\n🔗 Generate Incoming Onboarding URL');
  console.log('====================================');
  console.log('Enter values for each query parameter (press Enter to skip).\n');

  const params: Record<string, string> = {};

  for (const { key, prompt } of QUERY_PARAMS) {
    const value = await ask(`${prompt} (${key}): `);
    if (value) {
      params[key] = value;
    }
  }

  // Ask for custom base URL
  console.log('');
  const customBase = await ask(
    `Base URL (press Enter for default: ${BASE_URL}): `
  );
  const baseUrl = customBase || BASE_URL;

  rl.close();

  // Build the URL
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  console.log('\n✅ Generated URL:\n');
  console.log(url.toString());
  console.log('');
}

main().catch((err: unknown) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
