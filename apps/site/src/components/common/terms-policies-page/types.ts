// Copyright © Todd Agriscience, Inc. All rights reserved.

import type React from 'react';

/**
 * Props shared by every block in the terms & policies template.
 * @property children - Block content
 * @property className - Optional extra classes merged onto the root element
 */
export interface PolicyBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for the terms & policies page shell.
 * @property title - Page heading rendered as the `h1`
 * @property children - Page body, normally a series of `PolicySection`s
 * @property className - Optional extra classes merged onto the page container
 */
export interface TermsPoliciesPageProps extends PolicyBlockProps {
  title: string;
}

/**
 * Props for a titled section within a terms & policies page.
 * @property title - Optional section heading rendered as the `h2`
 * @property children - Section content
 * @property className - Optional extra classes merged onto the `section`
 */
export interface PolicySectionProps extends PolicyBlockProps {
  title?: string;
}

/**
 * Props for a repeated entry heading.
 * @property level - Heading level to render; defaults to `h4`
 * @property children - Heading content
 * @property className - Optional extra classes merged onto the heading
 */
export interface PolicyItemHeadingProps extends PolicyBlockProps {
  level?: 3 | 4;
}

/**
 * Props for a list of policy items.
 * @property items - Rendered list entries, in order
 * @property ordered - Renders an `ol` instead of the default `ul`
 * @property className - Optional extra classes merged onto the list element
 */
export interface PolicyListProps {
  items: React.ReactNode[];
  ordered?: boolean;
  className?: string;
}
