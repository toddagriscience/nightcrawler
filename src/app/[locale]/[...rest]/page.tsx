// Copyright Todd Agriscience, Inc. All rights reserved.

import LocaleNotFound from '../not-found';

/**
 * Catch all unmatched routes within locale and render 404
 * @returns {React.ReactNode} - The 404 page component
 */
export default function CatchAllPage() {
  return <LocaleNotFound />;
}
