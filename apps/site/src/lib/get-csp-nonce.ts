// Copyright © Todd Agriscience, Inc. All rights reserved.

import { headers } from 'next/headers';

/**
 * Reads the nonce forwarded by the proxy and opts the HTML root into dynamic
 * rendering. Never cache this value or a document containing it across requests.
 */
export async function getCspNonce(): Promise<string | undefined> {
  const nonce = (await headers()).get('x-nonce');
  return nonce && /^[A-Za-z0-9+/]{32}$/.test(nonce) ? nonce : undefined;
}
