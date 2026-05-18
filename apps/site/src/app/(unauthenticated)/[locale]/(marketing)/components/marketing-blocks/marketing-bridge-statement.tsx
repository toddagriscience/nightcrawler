// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Props for {@link MarketingBridgeStatement} */
export interface MarketingBridgeStatementProps {
  /** Short, prominent line between hero and body content */
  text: string;
}

/**
 * Centered transitional statement (larger type, semibold) between hero and prose sections.
 *
 * @param props - Wrapper props
 * @param props.text - Line displayed centered between hero and body content
 */
export function MarketingBridgeStatement({
  text,
}: MarketingBridgeStatementProps) {
  return (
    <p className="mx-auto max-w-3xl text-center text-2xl font-normal leading-snug tracking-tight text-foreground md:text-[28px] md:leading-snug">
      {text}
    </p>
  );
}
