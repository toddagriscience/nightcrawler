// Copyright © Todd Agriscience, Inc. All rights reserved.

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'live.com',
  'msn.com',
];

/**
 * Checks if an email is a "work email" by checking if it's in a list of common domains (see `PERSONAL_EMAIL_DOMAINS`)
 *
 * @param {string} email - The email to validate
 * @returns {boolean} - If the email's domain isn't in the list of personal email domains
 * */
export default function isWorkEmail(email: string): boolean {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) return false;

  const domain = email.slice(atIndex + 1).toLowerCase();
  return !PERSONAL_EMAIL_DOMAINS.includes(
    domain as (typeof PERSONAL_EMAIL_DOMAINS)[number]
  );
}
