// Copyright © Todd Agriscience, Inc. All rights reserved.

import { notFound } from 'next/navigation';

/**
 * Catch all unmatched routes within locale and render 404
 * @returns {never} - Triggers 404
 */
export default function CatchAllPage() {
  notFound();
}
