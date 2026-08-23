// Copyright © Todd Agriscience, Inc. All rights reserved.

/*
 * Shared between the client-side CursorFollower and the server components that
 * tag its hover targets. Kept in a directive-free module on purpose: values
 * exported from a `'use client'` file reach server components as client
 * references, not as strings, so a computed `data-*` key built from one would
 * be silently dropped by React DOM.
 */

/**
 * Attribute that marks an element as a hover target. Its value is the label the
 * follower displays while the pointer is over that element (already localized
 * by the server component that renders the markup).
 */
export const CURSOR_LABEL_ATTRIBUTE = 'data-cursor-label';
