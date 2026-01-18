// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ActionResponse } from '../types/action-response';

/**
 * Standardizes all the different error types produced by the login action into a list. Contrary to the majority of other functions in this file, this function can be used in any location in the codebase. It's just a helper function for formatting.
 *
 * @param state The current form action state
 * @returns A list of all the errors
 */
export function formatActionResponseErrors(
  state: ActionResponse | null
): string[] {
  if (!state) return [];

  const { error } = state;
  if (!error) return [];
  if (typeof error === 'string') return [error];
  if (error instanceof Error) return [error.message];

  const { errors } = error;
  if (errors) return errors;

  return [];
}
