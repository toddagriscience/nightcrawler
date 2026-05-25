// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Transparent layout wrapper for deprecated `/news/[slug]` paths (redirect handlers).
 *
 * @param props - Layout children slot
 */
export default function LegacyNewsSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
