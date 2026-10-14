// Copyright © Todd Agriscience, Inc. All rights reserved.

import ReactMarkdown from 'react-markdown';

/** Shared internal preview with responsive raster diagrams and no raw HTML. */
export function ImpMarkdown({ children }: { children?: string }) {
  return (
    <ReactMarkdown
      components={{
        img: ({ src, alt }) => (
          // Authenticated same-origin diagram route keeps the bucket and credentials private.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || 'IMP diagram'}
            loading="lazy"
            className="my-4 h-auto max-w-full rounded border"
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
