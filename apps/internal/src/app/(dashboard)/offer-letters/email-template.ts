// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Builds the offer email body that accompanies the generated PDF.
 *
 * @param name - Hiree full name; the greeting uses the first word
 * @param position - Position title
 * @returns Plain-text email body ready to paste
 */
export function buildOfferEmail(name: string, position: string): string {
  const firstName = name.trim().split(/\s+/)[0];
  return [
    `Hi ${firstName},`,
    '',
    '',
    `Congratulations! We are thrilled to invite you to join Todd as a ${position.trim()}.`,
    '',
    '',
    'Please review your offer and other important information below. To accept this offer, please reply to this email with "I Accept". By replying to this email, you agree that you accept electronic delivery of the following documents, and that you have carefully reviewed and agree to the terms of each and will retain copies for your records.',
    '',
    '',
    'Your recruiter is available to answer any questions you may have. We look forward to working with you.',
  ].join('\n');
}
