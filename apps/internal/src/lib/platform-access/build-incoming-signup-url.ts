// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Extracts signup prefill params from common answer keys.
 *
 * @param answers - Stored submission answers
 */
function extractSignupPrefillFromAnswers(answers: Record<string, unknown>): {
  firstName?: string;
  lastName?: string;
  farmName?: string;
  email?: string;
  phone?: string;
} {
  const read = (keys: string[]) => {
    for (const key of keys) {
      const value = answers[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    return undefined;
  };

  return {
    firstName: read(['firstName', 'first_name']),
    lastName: read(['lastName', 'last_name']),
    farmName: read(['farmName', 'farm_name']),
    email: read(['email']),
    phone: read(['phone']),
  };
}

/**
 * Builds an `/incoming` onboarding URL from application answers.
 *
 * @param baseUrl - Site origin without trailing slash
 * @param answers - Stored submission answers
 */
export function buildIncomingSignupUrl(
  baseUrl: string,
  answers: Record<string, unknown>
): string | null {
  const prefill = extractSignupPrefillFromAnswers(answers);
  if (!prefill.email) return null;

  const url = new URL('/incoming', baseUrl);
  if (prefill.firstName) url.searchParams.set('first_name', prefill.firstName);
  if (prefill.lastName) url.searchParams.set('last_name', prefill.lastName);
  if (prefill.farmName) url.searchParams.set('farm_name', prefill.farmName);
  url.searchParams.set('email', prefill.email);
  if (prefill.phone) url.searchParams.set('phone', prefill.phone);
  return url.toString();
}
