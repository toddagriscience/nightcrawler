/**
 * French (fr) translations barrel export
 *
 * This file combines all translation modules for the French locale
 * and provides a unified interface for the i18n system.
 */

import common from './common.json';
import metadata from './metadata.json';
import navigation from './navigation.json';
import homepage from './homepage.json';
import about from './about.json';
import contact from './contact.json';

export const de = {
  common,
  metadata,
  navigation,
  homepage,
  about,
  contact,
} as const;

export default de;

// Re-export individual modules for direct access if needed
export { common, metadata, navigation, homepage, about, contact };
