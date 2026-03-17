// Copyright © Todd Agriscience, Inc. All rights reserved.

import logger from '../logger';

type ActionErrorShape = {
  error?: unknown;
  errors?: string[];
  message?: string;
  properties?: Record<string, { errors?: string[] }>;
};

function collectActionErrorMessages(error: ActionErrorShape): string[] {
  const rootErrors = Array.isArray(error.errors) ? error.errors : [];
  const propertyErrors = Object.values(error.properties ?? {}).flatMap(
    ({ errors }) => errors ?? []
  );

  return [...rootErrors, ...propertyErrors];
}

/**
 * Standardizes action failures into a list of displayable messages.
 *
 * Accepts either a thrown error from a server action or a legacy action response
 * object that still exposes an `error` property.
 */
export function formatActionResponseErrors(error: unknown): string[] {
  if (!error) {
    return [];
  }

  if (typeof error === 'string') {
    return [error];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  if (typeof error !== 'object') {
    return [];
  }

  const maybeActionError = error as ActionErrorShape;

  if ('error' in maybeActionError) {
    return formatActionResponseErrors(maybeActionError.error);
  }

  const messages = collectActionErrorMessages(maybeActionError);
  if (messages.length > 0) {
    return messages;
  }

  if (typeof maybeActionError.message === 'string') {
    return [maybeActionError.message];
  }

  return [];
}

export function throwActionError(error: unknown): never {
  const [message] = formatActionResponseErrors(error);
  logger.error(error ?? 'An unknown error occurred.');
  throw new Error(message ?? 'An unknown error occurred.');
}
