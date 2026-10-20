// Copyright © Todd Agriscience, Inc. All rights reserved.

/** The searchable text shared by spreadsheet imports and catalog edits. */
export function generalImpEmbeddingText(imp: {
  title: string | null;
  tags: string[];
  content: string;
}): string {
  return [imp.title ?? '', imp.tags.join(' '), imp.content]
    .filter(Boolean)
    .join('\n');
}
