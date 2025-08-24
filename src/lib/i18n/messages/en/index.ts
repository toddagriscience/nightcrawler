/**
 * English (en) translations barrel export
 *
 * This file combines all translation modules for the English locale
 * and provides a unified interface for the i18n system.
 */

import common from './common.json';
import metadata from './metadata.json';
import navigation from './navigation.json';
import homepage from './homepage.json';
import about from './about.json';
import contact from './contact.json';

export const en = {
  common,
  metadata,
  navigation,
  homepage,
  about,
  contact,
} as const;

export default en;

// Re-export individual modules for direct access if needed
export { common, metadata, navigation, homepage, about, contact };
