// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  identifyImpDiagram,
  impDiagramMarkdown,
  impDiagramNamePattern,
  MAX_IMP_DIAGRAM_BYTES,
} from './imp-diagram';
const name = '12345678-1234-4123-8123-123456789abc.png';
describe('diagram references and raster validation', () => {
  it('rejects active content, empty and oversized uploads independently of filenames', () => {
    expect(
      identifyImpDiagram(
        new TextEncoder().encode('<svg onload="alert(1)"></svg>')
      )
    ).toBeNull();
    expect(identifyImpDiagram(new Uint8Array())).toBeNull();
    expect(
      identifyImpDiagram(new Uint8Array(MAX_IMP_DIAGRAM_BYTES + 1))
    ).toBeNull();
    const png = new Uint8Array(24);
    png.set([137, 80, 78, 71, 13, 10, 26, 10]);
    png.set([73, 72, 68, 82], 12);
    expect(identifyImpDiagram(png)).toEqual({
      extension: 'png',
      contentType: 'image/png',
    });
    expect(identifyImpDiagram(Uint8Array.from([255, 216, 255, 217]))).toEqual({
      extension: 'jpg',
      contentType: 'image/jpeg',
    });
  });
  it('accepts only generated object names and escapes Markdown alt text', () => {
    expect(impDiagramNamePattern.test('../secret.png')).toBe(false);
    expect(impDiagramNamePattern.test('another-prefix/file.png')).toBe(false);
    expect(impDiagramMarkdown(name, 'Scale [low]\\high\nnext')).toBe(
      `![Scale \\[low\\]\\\\high next](/api/imp-diagrams/${name})`
    );
    expect(() => impDiagramMarkdown(name, ' ')).toThrow();
  });
});
