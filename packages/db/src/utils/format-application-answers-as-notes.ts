// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Formats one stored answer value as markdown-safe plain text.
 *
 * @param value - Raw answer from a platform access application
 */
function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.map((entry) => formatAnswerValue(entry)).join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

/**
 * Builds initial advisor profile notes from a platform-access request submission.
 *
 * @param input - CMS form slug and stored field answers
 */
export function formatApplicationAnswersAsAdvisorNotes(input: {
  formSlug: string;
  answers: Record<string, unknown>;
}): string {
  const header = `# Platform access request (${input.formSlug})`;
  const lines = Object.entries(input.answers)
    .filter(([, value]) => formatAnswerValue(value).length > 0)
    .map(([key, value]) => `- **${key}:** ${formatAnswerValue(value)}`);

  if (lines.length === 0) {
    return `${header}\n\n_No answers recorded._`;
  }

  return `${header}\n\n${lines.join('\n')}`;
}
