// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { requireInternalAccount } from '@/lib/require-internal-account';
import { logger } from '@/lib/logger';
import { putImpDiagram } from '@nightcrawler/db/utils/imp-diagram-storage';
import {
  impDiagramMarkdown,
  MAX_IMP_DIAGRAM_BYTES,
} from '@nightcrawler/db/utils/imp-diagram';

/** Uploads a manual diagram for staff; saving the returned Markdown publishes its reference. */
export async function uploadImpDiagram(
  form: FormData
): Promise<{ ok: true; markdown: string } | { ok: false; error: string }> {
  await requireInternalAccount();
  const file = form.get('file');
  const alt = form.get('alt');
  if (
    !file ||
    typeof file === 'string' ||
    !file.size ||
    file.size > MAX_IMP_DIAGRAM_BYTES ||
    typeof alt !== 'string' ||
    !alt.trim() ||
    alt.length > 1000
  )
    return {
      ok: false,
      error:
        'Choose a PNG, JPEG or WebP up to 512 KiB and describe the diagram.',
    };
  try {
    const name = await putImpDiagram(new Uint8Array(await file.arrayBuffer()));
    return { ok: true, markdown: impDiagramMarkdown(name, alt) };
  } catch (error) {
    logger.error('Failed to upload IMP diagram:', error);
    return {
      ok: false,
      error:
        'Diagram upload failed. Verify the image format and the private storage configuration, then retry.',
    };
  }
}
