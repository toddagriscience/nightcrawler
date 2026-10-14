// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Stay below the existing Next server-action request limit. */
export const MAX_IMP_DIAGRAM_BYTES = 512 * 1024;

/** Only application-generated object names are addressable, never bucket paths. */
export const impDiagramNamePattern =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.(png|jpg|webp)$/;

/** Detect allowed raster formats from bytes instead of trusting upload MIME/name. */
export function identifyImpDiagram(
  bytes: Uint8Array
): { extension: 'png' | 'jpg' | 'webp'; contentType: string } | null {
  if (bytes.length === 0 || bytes.length > MAX_IMP_DIAGRAM_BYTES) return null;
  if (
    bytes.length >= 24 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (byte, index) => bytes[index] === byte
    ) &&
    String.fromCharCode(...bytes.slice(12, 16)) === 'IHDR'
  ) {
    return { extension: 'png', contentType: 'image/png' };
  }
  if (
    bytes.length >= 4 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255 &&
    bytes.at(-2) === 255 &&
    bytes.at(-1) === 217
  ) {
    return { extension: 'jpg', contentType: 'image/jpeg' };
  }
  if (
    bytes.length >= 20 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return { extension: 'webp', contentType: 'image/webp' };
  }
  return null;
}

/** Encodes image alt text without allowing it to introduce another Markdown node. */
export function impDiagramMarkdown(name: string, alt: string): string {
  if (!impDiagramNamePattern.test(name) || !alt.trim() || alt.length > 1000)
    throw new Error('Invalid diagram reference.');
  const escaped = alt
    .trim()
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\\\[\]]/g, '\\$&');
  return `![${escaped}](/api/imp-diagrams/${name})`;
}
