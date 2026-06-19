// Copyright © Todd Agriscience, Inc. All rights reserved.

import ReactMarkdown from 'react-markdown';

export function ImpMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mt-8 text-3xl font-semibold text-foreground first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-8 text-2xl font-semibold text-foreground">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-6 text-xl font-semibold text-foreground">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mt-4 text-base leading-7 text-foreground/85">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-foreground/85">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7 text-foreground/85">
            {children}
          </ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-4 border-l-4 border-emerald-700/30 pl-4 italic text-foreground/70">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm text-foreground">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
